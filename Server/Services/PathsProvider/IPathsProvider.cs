namespace Server.Services
{
    public interface IPathsProvider
    {
        string MonoPackagerPath { get; }

        /// Path to the directory that contains subdirectories with DLLs for the task definition
        string TaskDefinitionsDirectoryPath { get; }

        /// Path to the directory that contains subdirectories with WASM packaged code ready for
        /// clients to consume
        string CompiledTasksDefinitionsDirectoryPath { get; }
    }
}
