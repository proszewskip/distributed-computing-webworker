using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Server.DTO
{
    public class ComputationSuccessDTO
    {
        [Required]
        public int SubtaskInProgressId { get; set; }


        [Required]
        public string DistributedNodeId { get; set; }

        [Required]
        public IFormFile SubtaskResult { get; set; }
    }
}
