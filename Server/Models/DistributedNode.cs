using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedNode : Identifiable<Guid>
    {
        [Required]
        [Attr("last-keep-alive-time", isImmutable: true)]
        public DateTime LastKeepAliveTime { get; set; }

        [Required]
        [Attr("trust-level")]
        public double TrustLevel { get; set; } = 1;

        [HasMany("subtasks-in-progress")]
        public virtual List<SubtaskInProgress> SubtasksInProgress { get; set; }

        // TODO: add fields for CPU and device information
    }
}
