using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Server.DTO
{
    public class AssignNextSubtaskDTO
    {
        [Required]
        [JsonProperty("distributed-node-id")]
        public string DistributedNodeId { get; set; }
    }
}
