using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Server.DTO
{
    public class FinishSubtaskDTO
    {
        [Required]
        [JsonProperty("distributed-node-id")]
        public string DistributedNodeId { get; set; }

        [Required]
        [JsonProperty("subtask-result")]
        public byte[] SubtaskResult { get; set; }

        [JsonProperty("errors")]
        public string[] Errors { get; set; }
    }
}
