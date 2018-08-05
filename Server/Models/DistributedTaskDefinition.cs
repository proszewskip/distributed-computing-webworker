using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedTaskDefinition : Identifiable
    {
        [Required]
        [Attr("name")]
        public string Name { get; set; }

        [Attr("description")]
        public string Description { get; set; } = "";

        [HasMany("distributed-tasks")]
        public List<DistributedTask> DistributedTasks { get; set; }

        // TODO: find out if DefintionGuid needs to be public
        [Required]
        [Attr("definition-guid", isImmutable: true)]
        public Guid DefinitionGuid { get; set; }

        // TODO: find out if MainDllName needs to be public
        [Required]
        [Attr("main-dll-name", isImmutable: true)]
        public string MainDllName { get; set; }

        [Attr("subtask-info", isImmutable: true)]
        [Required]
        public SubtaskInfo SubtaskInfo { get; set; }
    }
}
