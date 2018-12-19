using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class Subtask : Identifiable
    {
        /// <summary>
        /// ModelId is used to enable sorting of subtasks by id.
        /// </summary>
        [Attr("id", isImmutable: true)]
        public int ModelId => Id;

        /// <summary>
        /// The index of the subtask, as used when splitting the task data
        /// into subtasks.
        /// </summary>
        [Required]
        [Attr("sequence-number", isImmutable: true)]
        public int SequenceNumber { get; set; }

        [Attr("distributed-task-id", isImmutable: true)]
        public int DistributedTaskId { get; set; }

        [Required]
        [HasOne("distributed-task")]
        public DistributedTask DistributedTask { get; set; }

        /// <summary>
        /// The input data for the subtask, as returned by SubtaskDataFormatter
        /// in IProblemPlugin
        /// </summary>
        [Required]
        public byte[] InputData { get; set; }

        /// <summary>
        /// The subtask results, as returned by SubtaskResultDataFormatter in IProblemPlugin.
        /// </summary>
        public byte[] Result { get; set; }

        [Required]
        [Attr("subtask-status", isImmutable: true)]
        public SubtaskStatus Status { get; set; }

        [HasMany("subtasks-in-progress")]
        public virtual List<SubtaskInProgress> SubtasksInProgress { get; set; }
    }
}
