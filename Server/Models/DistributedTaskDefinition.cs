using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class DistributedTaskDefinition : Identifiable
    {
        /// <summary>
        /// Distributed Task Definition's name.
        ///
        /// Has to be unique.
        /// </summary>
        [Required]
        [Attr("name")]
        public string Name { get; set; }

        [Attr("description")]
        public string Description { get; set; } = "";

        [HasMany("distributed-tasks")]
        public List<DistributedTask> DistributedTasks { get; set; }

        /// <summary>
        /// An unique identifier of this task definition.
        ///
        /// Serves as part of the path on which the files for this entity
        /// are saved in the file system and will be served to nodes.
        ///
        /// Guid is used to prevent nodes from guessing the IDs of other
        /// tasks and potentially downloading task-related files.
        /// </summary>
        // TODO: find out if DefintionGuid needs to be public
        [Required]
        [Attr("definition-guid", isImmutable: true)]
        public Guid DefinitionGuid { get; set; }

        /// <summary>
        /// The name of the DLL containing the class that implements
        /// ProblemPluginFactory.
        /// </summary>
        // TODO: find out if MainDllName needs to be public
        [Required]
        [Attr("main-dll-name", isImmutable: true)]
        public string MainDllName { get; set; }

        /// <summary>
        /// Information about the assembly, namespace and class name
        /// of the class that implements ProblemPluginFactory.
        /// </summary>
        [Attr("problem-plugin-info", isImmutable: true)]
        [Required]
        public ProblemPluginInfo ProblemPluginInfo { get; set; }

        /// <summary>
        /// Logs from the process of packaging the DLLs to WebAssembly.
        /// </summary>
        [Attr("packager-logs")]
        public string PackagerLogs { get; set; } = "";
    }
}
