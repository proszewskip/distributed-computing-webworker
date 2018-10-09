using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Server.DTO
{
    public class FailedSubtaskDTO
    {
        [Required]
        public string DistributedNodeId { get; set; }

        [Required]
        public string[] Errors { get; set; }
    }
}
