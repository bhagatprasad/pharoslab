using Pharoslab.Web.API.Models;

namespace Pharoslab.Web.API.Managers
{
    public interface IUserManager
    {
        Task<UserInfirmation> FetchUserByIdAsync(Guid userId);
        Task<List<UserInfirmation>> FetchUsersAsync();
        Task<UserInfirmation> InsertOrUpdateUserAsync(UserRegistration userRegistration);

        Task<List<UserProfessional>> InsertOrUpdateUserProfessionalAsync(UserProfessional userProfessional);
        Task<List<UserProfessional>> FetchUserProfessionalsAsync(Guid userId);

        Task<List<UserHobbies>> InsertOrUpdateUserHobbiesAsync(UserHobbies userHobbies);
        Task<List<UserHobbies>> FetchUserUserHobbiessAsync(Guid userId);
    }
}
