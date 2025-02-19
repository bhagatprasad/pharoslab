using Pharoslab.Web.API.Models;

namespace Pharoslab.Web.API.Managers
{
    public interface IUserManager
    {
        Task<UserInfirmation> FetchUserByIdAsync(Guid userId);
        Task<List<UserInfirmation>> FetchUsersAsync();
        Task<UserInfirmation> InsertOrUpdateUserAsync(UserRegistration userRegistration);
    }
}
