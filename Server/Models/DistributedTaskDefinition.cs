using System.Collections.Generic;

namespace Server.Models
{
    public class DistributedTaskDefinition
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public List<DistributedTask> DistributedTasks { get; set; }

        public string OutputDirectory { get; set; }

        public SubtaskInfo SubtaskInfo { get; set; }
    }
}
