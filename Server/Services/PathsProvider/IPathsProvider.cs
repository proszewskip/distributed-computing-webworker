using System;

namespace Server.Services
{
    public interface IPathsProvider
    {
        string MonoPackagerPath { get; }

        /// Path to the directory that contains subdirectories with WASM packaged code ready for
        /// clients to consume
        string CompiledTasksDefinitionsDirectoryPath { get; }

        string GetTaskDefinitionDirectoryPath(Guid guid);

        string GetCompiledTaskDefinitionDirectoryPath(Guid guid);

        string GetCompiledTaskDefinitionMainAssemblyPath(Guid guid, string mainDllName);
    }
}
