using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Server.DTO
{
    public class ComputationSuccessDTO
    {
        [Required] public int SubtaskInProgressId { get; set; }

        [Required] public string DistributedNodeId { get; set; }

        [Required] public IFormFile SubtaskResult { get; set; }
    }
}
