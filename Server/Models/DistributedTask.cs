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
        [Attr("input-data", isImmutable: true, isFilterable: false, isSortable: false)]
        public string InputData { get; set; }

        [Attr("status", isImmutable: true)]
        public DistributedTaskStatus Status { get; set; } = DistributedTaskStatus.InProgress;

        [Attr("result", isImmutable: true)]
        public string Result { get; set; }

        [HasMany("subtasks")]
        public virtual List<Subtask> Subtasks { get; set; }
    }
}
