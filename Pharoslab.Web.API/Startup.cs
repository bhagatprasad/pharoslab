using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Pharoslab.Web.API.DataManagers;
using Pharoslab.Web.API.DBConfiguration;
using Pharoslab.Web.API.Managers;
using System.Text;

namespace Pharoslab.Web.API
{
    public class Startup
    {

        private readonly IConfiguration _configuration;
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDBContext>(options => options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"),
                                                       sqlServerOptionsAction: sqlOptions =>
                                                       {
                                                           sqlOptions.EnableRetryOnFailure(
                                                               maxRetryCount: 5,
                                                               maxRetryDelay: TimeSpan.FromSeconds(30),
                                                               errorNumbersToAdd: null);
                                                       }));

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            });


            services.AddMvc().AddXmlSerializerFormatters();

            services.AddScoped<IAuthenticationManager, AuthenticationDataManager>();

            services.AddScoped<IUserManager, UserDataManager>();

            var tokenKey = _configuration.GetValue<string>("tokenKey");


            var key = !string.IsNullOrEmpty(tokenKey) ? Encoding.ASCII.GetBytes(tokenKey) : Encoding.ASCII.GetBytes("test");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateActor = false
                };
            });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                                   builder => builder
                                  .AllowAnyOrigin()
                                  .AllowAnyHeader()
                                  .AllowAnyMethod()
                                  .WithMethods("GET", "PUT", "DELETE", "POST", "PATCH")
                                  );
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Pharoslab.Web.API",
                    Description = "Pharoslab.Web.API",
                    Contact = new OpenApiContact
                    {
                        Name = "Pharoslab.Web.API Service",
                        Email = "contact@test.in",
                        Url = new Uri("https://test.in")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "contact@bdprasad.in",
                        Url = new Uri("https://test.in")
                    }

                });
                c.AddSecurityDefinition("Authorization", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter the Authorization header using the Bearer scheme.",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                 {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Authorization"
                                }
                            },
                            Array.Empty<string>()
                        }
                    });

            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseCors("CorsPolicy");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

            });

            app.UseStaticFiles();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Pharoslab.Web.API");
            });

        }
    }
}