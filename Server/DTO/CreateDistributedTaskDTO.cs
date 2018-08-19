using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Models;
using Microsoft.AspNetCore.Http;

namespace Server.DTO
{
    public class CreateDistributedTaskDTO
    {
        [Required]
        public string Name { get; set; }

        [Attr("description")]
        public string Description { get; set; } = "";

        [Required]
        public int Priority { get; set; }

        [Required]
        public double TrustLevelToComplete { get; set; }

        [Required]
        public int DistributedTaskDefinitionId { get; set; }

        [Required]
        public IFormFile InputData { get; set; }
    }
}
