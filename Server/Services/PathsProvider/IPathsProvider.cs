using System;

namespace Server.Services
{
    /// <summary>
    ///     Service that provides paths to different resources used in the system.
    /// </summary>
    public interface IPathsProvider
    {
        /// <summary>
        ///     Path to a directory containing files required to run a task
        ///     in WebAssembly.
        ///     The files for one task are grouped into a single directory.
        /// </summary>
        string CompiledTasksDefinitionsDirectoryPath { get; }

        /// <summary>
        ///     Returns a path to the directory containing DLLs constituting
        ///     a single task.
        /// </summary>
        /// <param name="guid">DefinitionGuid of a task</param>
        /// <returns>A path to a directory containing DLLs constituting a single task</returns>
        string GetTaskDefinitionDirectoryPath(Guid guid);

        /// <summary>
        ///     Returns a path to the directory containing files required to run a single task in WebAssembly.
        /// </summary>
        /// <param name="guid">DefinitionGuid of a task</param>
        /// <returns>A path to a directory containing files required to run a single task in WebAssembly</returns>
        string GetCompiledTaskDefinitionDirectoryPath(Guid guid);

        /// <summary>
        ///     Returns a path to the DLL containing the assembly that has a class which implements IProblemPlugin
        ///     for a given task.
        /// </summary>
        /// <param name="guid"></param>
        /// <param name="mainDllName"></param>
        /// <returns></returns>
        string GetTaskDefinitionMainAssemblyPath(Guid guid, string mainDllName);

        /// <summary>
        ///     Returns a web path to the directory containing files required to run a single task in WebAssembly.
        ///     Returned address has format of '/public/task-definitions/{guid}'
        /// </summary>
        /// <param name="guid">DefinitionGuid of a task</param>
        /// <returns>A path to a directory containing files required to run a single task in WebAssembly</returns>
        string GetCompiledTaskDefinitionWebPath(Guid guid);
    }
}
