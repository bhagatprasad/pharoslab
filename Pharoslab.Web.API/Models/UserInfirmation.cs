namespace Pharoslab.Web.API.Models
{
    public class UserInfirmation
    {
        public UserInfirmation()
        {
            userHobbies = new List<UserHobbies>();
            userProfessionals = new List<UserProfessional>();
        }
        public Guid? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTimeOffset? LastPasswordChangedOn { get; set; }
        public bool? IsBlocked { get; set; }
        public Guid? CreatedBy { get; set; }
        public DateTimeOffset? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public DateTimeOffset? ModifiedOn { get; set; }
        public bool IsActive { get; set; }
        public List<UserHobbies> userHobbies { get; set; }
        public List<UserProfessional> userProfessionals { get; set; }
    }
}
