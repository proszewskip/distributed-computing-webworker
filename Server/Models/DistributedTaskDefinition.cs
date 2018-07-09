using System.Collections.Generic;

namespace Server.Models
{
    public class DistributedTaskDefinition
    {
        // TODO: add GUID to reference the task definition during packaging
        // (see DistributedTaskDefinitionController.cs)

        public int Id { get; set; }

        public string Name { get; set; }

        public List<DistributedTask> DistributedTasks { get; set; }

        public string OutputDirectory { get; set; }

        public SubtaskInfo SubtaskInfo { get; set; }
    }
}
