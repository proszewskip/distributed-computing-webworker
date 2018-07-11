using System.IO;
using System.Threading.Tasks;
using Server.Services.CommandRunner;
using Server.Services.PathsProvider;

namespace Server.Services
{
    public class PackagerRunner : IPackagerRunner
    {
        private readonly IPathsProvider _pathsProvider;

        private readonly ICommandRunner _commandRunner;

        private const string MonoCommand = "mono";

        public PackagerRunner(IPathsProvider pathsProvider, ICommandRunner commandRunner)
        {
            _pathsProvider = pathsProvider;
            _commandRunner = commandRunner;
        }

        public Task<CommandRunnerResult> PackAssemblyAsync(string assemblyDirectoryName, string assemblyName)
        {
            // TODO: inject packagerOutputPath and assembliesDirectoryPath as parameters
            var packagerOutputPath = Path.Combine(
                _pathsProvider.CompiledTasksDefinitionsDirectoryPath, assemblyDirectoryName);
            var assembliesDirectoryPath = Path.Combine(
                _pathsProvider.TaskDefinitionsDirectoryPath, assemblyDirectoryName);

            var prefixArg = $"-prefix={assembliesDirectoryPath}";
            var outArg = $"-out={packagerOutputPath}";
            var packCommandArgs = $"{_pathsProvider.MonoPackagerPath} {prefixArg} {outArg} {assemblyName}";

            return _commandRunner.RunCommandTask(MonoCommand, packCommandArgs);
        }
    }
}
