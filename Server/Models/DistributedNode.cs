using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedNode : Identifiable<Guid>
    {
        private static readonly double DefaultTrustLevel = 1;

        [Required]
        [Attr("last-keep-alive-time")]
        public DateTime LastKeepAliveTime { get; set; }

        [Required]
        [Attr("trust-level")]
        public double TrustLevel { get; set; } = DefaultTrustLevel;

        [HasMany("subtasks-in-progress")]
        public virtual List<SubtaskInProgress> SubtasksInProgress { get; set; }

        // TODO: add fields for CPU and device information
    }
}
