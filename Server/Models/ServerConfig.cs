namespace Server.Models
{
    public class ServerConfig
    {
        /// <summary>
        ///     Path to a directory containing DLLs constituting a single task.
        ///     The DLLs for one task are grouped into a single directory.
        /// </summary>
        public string TaskDefinitionsDirectoryPath { get; set; }

        /// <summary>
        ///     Path to a directory containing files required to run a task
        ///     in WebAssembly.
        ///     The files for one task are grouped into a single directory.
        /// </summary>
        public string CompiledTaskDefinitionsDirectoryPath { get; set; }
    }
}
