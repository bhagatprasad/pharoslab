using Pharoslab.Web.API.Models;

namespace Pharoslab.Web.API.Managers
{
    public interface IAuthenticationManager
    {
        Task<AuthResponse> AuthenticateUserAsync(UserAuthentication authentication);
        Task<ApplicationUser> GenarateUserClaimsAsync(AuthResponse auth);
    }
}
