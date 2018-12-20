using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Server.DTO
{
    public class AssignNextSubtaskDTO
    {
        [Required]
        [JsonProperty("distributed-node-id")]
        public string DistributedNodeId { get; set; }
    }
}
