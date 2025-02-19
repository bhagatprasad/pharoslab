using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pharoslab.Web.API.DBConfiguration;
using Pharoslab.Web.API.Managers;
using Pharoslab.Web.API.Models;
using Pharoslab.Web.API.Utility;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Pharoslab.Web.API.DataManagers
{
    public class AuthenticationDataManager : IAuthenticationManager
    {
        private readonly ApplicationDBContext _dBContext;
        private string _tokenKey = string.Empty;

        public AuthenticationDataManager(ApplicationDBContext dBContext, IConfiguration configuration)
        {
            _dBContext = dBContext;
            _tokenKey = configuration.GetValue<string>("tokenKey");
        }
        public async Task<AuthResponse> AuthenticateUserAsync(UserAuthentication authentication)
        {
            AuthResponse authResponse = null;

            if (authentication != null)
            {
                if (!string.IsNullOrEmpty(authentication.username))
                {
                    var user = await _dBContext.users.Where(x => x.Email.ToLower().Trim() == authentication.username.ToLower().Trim() || x.Phone.Trim() == authentication.username.Trim()).FirstOrDefaultAsync();
                    if (user != null)
                    {
                        if (user.IsActive.Value)
                        {
                            if (user.IsBlocked.HasValue && user.IsBlocked.Value)
                            {
                                authResponse = new AuthResponse()
                                {
                                    IsActive = true,
                                    JwtToken = "",
                                    StatusCode = 1000,
                                    StatusMessage = "user blocked contact admin",
                                    ValidPassword = false,
                                    ValidUser = true
                                };
                            }
                            else
                            {
                                if (!string.IsNullOrEmpty(authentication.password))
                                {
                                    var validPassword = PharoslabHashSalt.VerifyPassword(authentication.password, user.PasswordHash, user.PasswordSalt);
                                    if (validPassword)
                                    {

                                        var tokenHandler = new JwtSecurityTokenHandler();

                                        var tokenKey = Encoding.ASCII.GetBytes(_tokenKey);

                                        var tokenDescrptor = new SecurityTokenDescriptor
                                        {
                                            Subject = new System.Security.Claims.ClaimsIdentity(new Claim[]
                                            {
                                                new Claim(ClaimTypes.Name,authentication.username),
                                            }),
                                            Expires = DateTime.UtcNow.AddHours(1),
                                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey),
                                            SecurityAlgorithms.HmacSha256Signature)
                                        };

                                        var token = tokenHandler.CreateToken(tokenDescrptor);

                                        var wrtetoekn = tokenHandler.WriteToken(token);

                                        authResponse = new AuthResponse()
                                        {
                                            IsActive = true,
                                            JwtToken = wrtetoekn,
                                            StatusCode = StatusCodes.Status200OK,
                                            StatusMessage = "valid user",
                                            ValidPassword = true,
                                            ValidUser = true
                                        };

                                    }
                                    else
                                    {
                                        authResponse = new AuthResponse()
                                        {
                                            IsActive = true,
                                            JwtToken = "",
                                            StatusCode = 1001,
                                            StatusMessage = "invalid password",
                                            ValidPassword = false,
                                            ValidUser = true
                                        };
                                    }
                                }
                                else
                                {
                                    authResponse = new AuthResponse()
                                    {
                                        IsActive = true,
                                        JwtToken = "",
                                        StatusCode = 1002,
                                        StatusMessage = "password required",
                                        ValidPassword = false,
                                        ValidUser = true
                                    };
                                }
                            }
                        }
                        else
                        {
                            authResponse = new AuthResponse()
                            {
                                IsActive = true,
                                JwtToken = "",
                                StatusCode = 1003,
                                StatusMessage = "user inactive contact admin",
                                ValidPassword = false,
                                ValidUser = true
                            };
                        }


                    }
                    else
                    {
                        authResponse = new AuthResponse()
                        {
                            IsActive = false,
                            JwtToken = "",
                            StatusCode = 1004,
                            StatusMessage = "invalid user",
                            ValidPassword = false,
                            ValidUser = false
                        };
                    }
                }
                else
                {
                    authResponse = new AuthResponse()
                    {
                        IsActive = false,
                        JwtToken = "",
                        StatusCode = 1005,
                        StatusMessage = "username required",
                        ValidPassword = false,
                        ValidUser = false
                    };
                }
            }
            else
            {
                authResponse = new AuthResponse()
                {
                    IsActive = false,
                    JwtToken = "",
                    StatusCode = 1006,
                    StatusMessage = "invalid user",
                    ValidPassword = false,
                    ValidUser = false
                };
            }

            return authResponse;

        }

        public async Task<ApplicationUser> GenarateUserClaimsAsync(AuthResponse auth)
        {
            try
            {
                ApplicationUser applicationUser = null;

                var toeknKey = Encoding.ASCII.GetBytes(_tokenKey);
                var tokenHandler = new JwtSecurityTokenHandler();
                SecurityToken securityToken;
                var principle = tokenHandler.ValidateToken(auth.JwtToken,
                    new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(toeknKey),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    }, out securityToken);
                var jwtTken = securityToken as JwtSecurityToken;

                if (jwtTken != null && jwtTken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256))
                {
                    string username = principle.Identity.Name;

                    var user = await _dBContext.users.Where(x => x.Email.ToLower().Trim() == username.ToLower().Trim() || x.Phone.Trim() == username.Trim()).FirstOrDefaultAsync();
                    if (user != null)
                    {
                        applicationUser = new ApplicationUser()
                        {
                            Id = user.Id,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            FullName = user.FirstName + " " + user.LastName,
                            Phone = user.Phone
                        };
                    }

                }
                return applicationUser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
