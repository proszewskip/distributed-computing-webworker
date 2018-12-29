using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedNode : Identifiable<Guid>
    {
        private static readonly double DefaultTrustLevel = 1;

        /// <summary>
        /// ModelId is used to allow filtering and sorting of distributed nodes.
        /// </summary>
        [Attr("id", isImmutable: true)]
        public string ModelId => Id.ToString();

        /// <summary>
        /// The last time the node communicated with the server.
        ///
        /// After some time passes during which there was no communication
        /// with the node, the node is removed.
        /// </summary>
        [Attr("last-keep-alive-time")]
        public DateTime LastKeepAliveTime { get; set; }

        /// <summary>
        /// Node's level of trust. The higher, the more trusted this node's results
        /// will be.
        /// </summary>
        [Attr("trust-level")]
        public double TrustLevel { get; set; } = DefaultTrustLevel;

        [HasMany("subtasks-in-progress")]
        public virtual List<SubtaskInProgress> SubtasksInProgress { get; set; }

        // TODO: add fields for CPU and device information
    }
}
