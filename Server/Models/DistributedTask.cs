using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedTask : Identifiable
    {
        /// <summary>
        ///     ModelId is used to enable sorting of distributed tasks by id.
        /// </summary>
        [Attr("id", true)]
        public int ModelId => Id;

        /// <summary>
        ///     The name of the task. Has to be unique.
        /// </summary>
        [Required]
        [Attr("name")]
        public string Name { get; set; }

        [Attr("description")] public string Description { get; set; } = "";

        /// <summary>
        ///     Task with the highest priority will be assigned to distributed nodes first.
        /// </summary>
        [Required]
        [Attr("priority")]
        public int Priority { get; set; }

        /// <summary>
        ///     Required trust level to complete each subtask in a task.
        ///     Whenever a node completes its subtask, the trust level of nodes
        ///     that calculated that subtask is summed up. If it exceeds `TrustLevelToComplete`,
        ///     the subtask is marked as done.
        /// </summary>
        [Required]
        [Attr("trust-level-to-complete")]
        public double TrustLevelToComplete { get; set; }

        /// <summary>
        ///     The ID of the definition for this task.
        ///     Exposed to allow for server-side filtering.
        /// </summary>
        [Attr("distributed-task-definition-id", true)]
        public int DistributedTaskDefinitionId { get; set; }

        [Required]
        [HasOne("distributed-task-definition")]
        public virtual DistributedTaskDefinition DistributedTaskDefinition { get; set; }

        /// <summary>
        ///     Input data for the whole task.
        ///     These are raw bytes read from the file received from the user while
        ///     creating the task.
        /// </summary>
        [Required]
        public byte[] InputData { get; set; }

        [Attr("status", true)] public DistributedTaskStatus Status { get; set; } = DistributedTaskStatus.InProgress;

        /// <summary>
        ///     The task result.
        ///     Raw bytes, as returned by the TaskResultDataFormatter.Serialize.
        ///     Available only after the task's status is Done.
        /// </summary>
        public byte[] Result { get; set; }

        /// <summary>
        ///     Array of errors that have appeared during splitting or combining the result.
        /// </summary>
        [Attr("errors")]
        public string[] Errors { get; set; } = { };

        [HasMany("subtasks")] public virtual List<Subtask> Subtasks { get; set; }
    }
}
