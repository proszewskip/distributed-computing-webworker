using System;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class SubtaskInProgress : Identifiable
    {
        [Required]
        public int SubtaskId { get; set; }

        [HasOne("subtask")]
        public virtual Subtask Subtask { get; set; }

        /// <summary>
        /// The ID of the distributed node that computes this subtask.
        /// </summary>
        [Required]
        public Guid NodeId { get; set; }

        [HasOne("node")]
        public virtual DistributedNode Node { get; set; }

        [Required]
        [Attr("status", isImmutable: true)]
        public SubtaskStatus Status { get; set; } = SubtaskStatus.Executing;

        /// <summary>
        /// Computation results
        /// </summary>
        public byte[] Result { get; set; }

        /// <summary>
        /// Possible errors that occurred during computation
        /// </summary>
        public string[] Errors { get; set; } = { };
    }
}
