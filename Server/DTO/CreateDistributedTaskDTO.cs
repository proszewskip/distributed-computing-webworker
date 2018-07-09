using System.ComponentModel.DataAnnotations;

namespace Server.DTO
{
    public class CreateDistributedTaskDTO
    {
        [Required]
        [StringLength(255, MinimumLength = 3)]
        public string Name { get; set; }

        [Required] public int Priority { get; set; }

        [Required] public int DistributedTaskDefinitionId { get; set; }

        [Required] public string InputData { get; set; }
    }
}
