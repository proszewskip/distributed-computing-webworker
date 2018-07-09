using System.Collections.Generic;

namespace Server.Models
{
    public class DistributedTask
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; } = "";

        public int Priority { get; set; }

        public int DistributedTaskDefinitionId { get; set; }
        public DistributedTaskDefinition DistributedTaskDefinition { get; set; }

        public string InputData { get; set; }

        public DistributedTaskStatus Status { get; set; }

        public string Result { get; set; }

        public List<Subtask> Subtasks { get; set; }
    }
}
