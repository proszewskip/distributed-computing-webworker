using System.ComponentModel.DataAnnotations;

namespace Server.DTO
{
    public class ComputationErrorDTO
    {
        [Required] public int SubtaskInProgressId { get; set; }

        [Required] public string DistributedNodeId { get; set; }

        [Required] public string[] Errors { get; set; }
    }
}
