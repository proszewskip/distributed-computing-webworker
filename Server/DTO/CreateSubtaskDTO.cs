using System.ComponentModel.DataAnnotations;

namespace Server.DTO
{
    public class CreateSubtaskDTO
    {
        [Required] public int SequenceNumber { get; set; }

        [Required] public int DistributedTaskId { get; set; }

        [Required] public string InputData { get; set; }
    }
}
