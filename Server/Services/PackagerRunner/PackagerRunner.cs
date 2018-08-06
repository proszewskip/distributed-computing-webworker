using System.IO;
using System.Threading.Tasks;

namespace Server.Services
{
    public class PackagerRunner : IPackagerRunner
    {
        private const string MonoCommand = "mono";

        private readonly ICommandRunner _commandRunner;
        private readonly IPathsProvider _pathsProvider;

        public PackagerRunner(IPathsProvider pathsProvider, ICommandRunner commandRunner)
        {
            _pathsProvider = pathsProvider;
            _commandRunner = commandRunner;
        }

        public Task<CommandRunnerResult> PackAssemblyAsync(string assemblyDirectoryPath, string outputDirectoryPath, string assemblyName)
        {
            var prefixArg = $"-prefix={assemblyDirectoryPath}";
            var outArg = $"-out={outputDirectoryPath}";
            var packCommandArgs = $"{_pathsProvider.MonoPackagerPath} {prefixArg} {outArg} {assemblyName}";

            return _commandRunner.RunCommandTask(MonoCommand, packCommandArgs);
        }
    }
}
