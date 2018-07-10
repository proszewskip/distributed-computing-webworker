using System;
using System.Collections.Generic;

namespace Server.Models
{
    public class DistributedTaskDefinition
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; } = "";

        public List<DistributedTask> DistributedTasks { get; set; }

        public Guid DefinitionGuid { get; set; }

        public SubtaskInfo SubtaskInfo { get; set; }
    }
}
