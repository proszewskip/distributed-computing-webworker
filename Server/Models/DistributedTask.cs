using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedTask : Identifiable
    {
        [Required]
        [Attr("name")]
        public string Name { get; set; }

        [Attr("description")]
        public string Description { get; set; } = "";

        [Required]
        [Attr("priority")]
        public int Priority { get; set; }

        public int DistributedTaskDefinitionId { get; set; }

        [Required]
        [HasOne("distributed-task-definition")]
        public virtual DistributedTaskDefinition DistributedTaskDefinition { get; set; }

        [Required]
        public byte[] InputData { get; set; }

        [Attr("status", isImmutable: true)]
        public DistributedTaskStatus Status { get; set; } = DistributedTaskStatus.InProgress;

        public byte[] Result { get; set; }

        [HasMany("subtasks")]
        public virtual List<Subtask> Subtasks { get; set; }
    }
}
