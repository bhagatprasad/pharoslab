using Microsoft.EntityFrameworkCore;
using Pharoslab.Web.API.DBConfiguration;
using Pharoslab.Web.API.Managers;
using Pharoslab.Web.API.Models;
using Pharoslab.Web.API.Utility;
using System.Data;

namespace Pharoslab.Web.API.DataManagers
{
    public class UserDataManager : IUserManager
    {
        private readonly ApplicationDBContext _dbContext;

        public UserDataManager(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<UserInfirmation> FetchUserByIdAsync(Guid userId)
        {
            var dbUser = await _dbContext.users.FindAsync(userId);
            return dbUser != null ? MapToUserInfirmation(dbUser) : null;
        }

        public async Task<List<UserInfirmation>> FetchUsersAsync()
        {
            var users = await _dbContext.users.ToListAsync();
            return users.Select(MapToUserInfirmation).ToList();
        }

        public async Task<UserInfirmation> InsertOrUpdateUserAsync(UserRegistration userRegistration)
        {
            var dbUser = MapToUser(userRegistration);

            if (userRegistration.Id == Guid.Empty || !userRegistration.Id.HasValue)
            {
                await _dbContext.users.AddAsync(dbUser);
            }
            else
            {
                var existingUser = await _dbContext.users.FindAsync(userRegistration.Id.Value);
                if (existingUser != null)
                {
                    UpdateExistingUser(existingUser, dbUser);
                }
                else
                {
                    await _dbContext.users.AddAsync(dbUser);
                }
            }

            await _dbContext.SaveChangesAsync();
            return MapToUserInfirmation(dbUser);
        }

        private void UpdateExistingUser(User existingUser, User dbUser)
        {
            bool hasChanges = EntityUpdater.HasChanges(existingUser, dbUser, nameof(User.CreatedBy), nameof(User.CreatedOn), nameof(User.PasswordHash), nameof(User.PasswordSalt));
            if (hasChanges)
            {
                EntityUpdater.UpdateProperties(existingUser, dbUser, nameof(User.CreatedBy), nameof(User.CreatedOn), nameof(User.PasswordHash), nameof(User.PasswordSalt));
            }
        }

        private User MapToUser(UserRegistration userRegistration)
        {
            var dbUser = new User
            {
                FirstName = userRegistration.FirstName,
                LastName = userRegistration.LastName,
                Email = userRegistration.Email,
                Phone = userRegistration.Phone,
                LastPasswordChangedOn = userRegistration.LastPasswordChangedOn,
                IsBlocked = userRegistration.IsBlocked ?? false,
                CreatedBy = userRegistration.CreatedBy,
                CreatedOn = userRegistration.CreatedOn ?? DateTimeOffset.UtcNow,
                ModifiedBy = userRegistration.ModifiedBy,
                ModifiedOn = userRegistration.ModifiedOn,
                IsActive = userRegistration.IsActive
            };

            if (!userRegistration.Id.HasValue)
            {
                var pharoslabHashSalt = PharoslabHashSalt.GenerateSaltedHash(userRegistration.Password);
                dbUser.PasswordHash = pharoslabHashSalt.Hash;
                dbUser.PasswordSalt = pharoslabHashSalt.Salt;
                dbUser.Id = Guid.NewGuid(); 
            }
            else
            {
                if (!string.IsNullOrEmpty(userRegistration.Password))
                {
                    var pharoslabHashSalt = PharoslabHashSalt.GenerateSaltedHash(userRegistration.Password);
                    dbUser.PasswordHash = pharoslabHashSalt.Hash;
                    dbUser.PasswordSalt = pharoslabHashSalt.Salt;
                }
                dbUser.Id = userRegistration.Id.Value;
            }

            return dbUser;
        }

        private UserInfirmation MapToUserInfirmation(User dbUser)
        {
            return new UserInfirmation
            {
                Id = dbUser.Id,
                FirstName = dbUser.FirstName,
                LastName = dbUser.LastName,
                FullName = $"{dbUser.FirstName} {dbUser.LastName}",
                Email = dbUser.Email,
                Phone = dbUser.Phone,
                LastPasswordChangedOn = dbUser.LastPasswordChangedOn,
                IsBlocked = dbUser.IsBlocked,
                CreatedBy = dbUser.CreatedBy,
                CreatedOn = dbUser.CreatedOn,
                ModifiedBy = dbUser.ModifiedBy,
                ModifiedOn = dbUser.ModifiedOn,
                IsActive = dbUser.IsActive ?? false
            };
        }
    }
}
