using System.ComponentModel.DataAnnotations;

namespace Server.DTO
{
    public class ModifyDistributedTaskDTO
    {
        [Required]
        [StringLength(255, MinimumLength = 3)]
        public string Name { get; set; }
    }
}
