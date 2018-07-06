using System.IO;
using System.Threading.Tasks;
using Server.Services.CommandRunner;

namespace Server.Services
{
    internal class PackagerRunner
    {
        private readonly string _inputDirectory;
        private readonly string _monoPackagerPath;
        private readonly string _outputDirectory;

        private readonly ICommandRunner _commandRunner;

        private const string MonoCommand = "mono";

        public PackagerRunner(string monoPackagerPath, string inputDirectory, string outputDirectory, ICommandRunner commandRunner)
        {
            _inputDirectory = inputDirectory;
            _outputDirectory = outputDirectory;
            _monoPackagerPath = monoPackagerPath;

            _commandRunner = commandRunner;
        }

        public async Task<int> PackAssemblyAsync(string assemblyDirectoryName, string assemblyName)
        {
            var packagerOutputPath = Path.Combine(_outputDirectory, assemblyDirectoryName);
            var assembliesDirectoryPath = Path.Combine(_inputDirectory, assemblyDirectoryName);

            var prefixArg = $"-prefix={assembliesDirectoryPath}";
            var outArg = $"-out={packagerOutputPath}";
            var packCommandArgs = $"{_monoPackagerPath} {prefixArg} {outArg} {assemblyName}";

            var exitCode = await _commandRunner.RunCommandTask(MonoCommand, packCommandArgs);

            return exitCode;
        }
    }
}
