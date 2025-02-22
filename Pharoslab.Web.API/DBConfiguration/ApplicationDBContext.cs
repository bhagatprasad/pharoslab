using Microsoft.EntityFrameworkCore;
using Pharoslab.Web.API.Models;

namespace Pharoslab.Web.API.DBConfiguration
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public DbSet<User> users { get; set; }

        public DbSet<UserHobbies> userHobbies { get; set; }
        public DbSet<UserProfessional> userProfessionals { get; set; }

    }
}
