using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Server.DTO
{
    public class ComputationCancelDTO
    {
        [Required]
        [JsonProperty("subtask-in-progress-id")]
        public int SubtaskInProgressId { get; set; }

        [Required]
        [JsonProperty("distributed-node-id")]
        public string DistributedNodeId { get; set; }
    }
}
