using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Models;
using Newtonsoft.Json;

namespace Server.Models
{
    public class SubtaskInProgress : Identifiable
    {
        public int SubtaskId { get; set; }

        [Required]
        [HasOne("subtask")]
        public virtual Subtask Subtask { get; set; }

        public Guid NodeId { get; set; }

        [Required]
        [HasOne("node")]
        public virtual DistributedNode Node { get; set; }

        [Required]
        [Attr("status", isImmutable: true)]
        public SubtaskStatus Status { get; set; } = SubtaskStatus.Executing;

        [JsonIgnore]
        public byte[] Result { get; set; }

        // TODO: verify that string[] is the correct type here
        public string[] Errors { get; set; }
    }
}
