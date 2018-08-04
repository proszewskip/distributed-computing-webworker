using System.Collections.Generic;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedTask : Identifiable
    {
        [Attr("name")]
        public string Name { get; set; }

        [Attr("description")]
        public string Description { get; set; } = "";

        [Attr("priority")]
        public int Priority { get; set; }

        public int DistributedTaskDefinitionId { get; set; }

        [HasOne("distributed-task-definition")]
        public DistributedTaskDefinition DistributedTaskDefinition { get; set; }

        [Attr("input-data", isImmutable: true, isFilterable: false, isSortable: false)]
        public string InputData { get; set; }

        [Attr("status", isImmutable: true)]
        public DistributedTaskStatus Status { get; set; }

        [Attr("result", isImmutable: true)]
        public string Result { get; set; }

        [HasMany("subtasks")]
        public List<Subtask> Subtasks { get; set; }
    }
}
