using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pharoslab.Web.API.Models
{
    [Table("UserProfessional")]
    public class UserProfessional
    {
        [Key]
        public Guid UserProfessionalId { get; set; }
        public Guid? UserId { get; set; }      
        public string? JobTitle { get; set; }      
        public string? Company { get; set; }        
        public Guid? CreatedBy { get; set; }         
        public DateTimeOffset? CreatedOn { get; set; } 
        public Guid? ModifiedBy { get; set; }      
        public DateTimeOffset? ModifiedOn { get; set; }
        public bool? IsActive { get; set; }
    }
}
