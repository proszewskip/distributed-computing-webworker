using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Server.DTO
{
    public class AssignNextSubtaskDTO
    {
        [Required]
        public Guid DistributedNodeId { get; set; }
    }
}
