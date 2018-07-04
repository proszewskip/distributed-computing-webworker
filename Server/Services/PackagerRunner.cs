using System.Diagnostics;
using System.Threading.Tasks;

namespace Server.Services
{
    internal class PackagerRunner
    {
        private readonly string _inputDirectory;
        private readonly string _monoPackagerPath;
        private readonly string _outputDirectory;

        public PackagerRunner(string monoPackagerPath, string inputDirectory, string outputDirectory)
        {
            _inputDirectory = inputDirectory;
            _outputDirectory = outputDirectory;
            _monoPackagerPath = monoPackagerPath;
        }

        public async Task<int> PackAssemblyAsync(string assemblyDirectory, string assemblyName)
        {
            var packagerOutputPath = $"{_outputDirectory}/{assemblyDirectory}";
            var prefixArg = $"-prefix={_inputDirectory}/{assemblyDirectory}";
            var outArg = $"-out={packagerOutputPath}";
            var packCommand = $"{_monoPackagerPath} {prefixArg} {outArg} {assemblyName}";

            var exitCode = await RunCommandTask(packCommand);

            return exitCode;
        }

        private Task<int> RunCommandTask(string cmdArgs)
        {
            var taskCompletionSource = new TaskCompletionSource<int>();

            var packagerProcess = new Process
            {
                StartInfo =
                {
                    FileName = "mono",
                    Arguments = cmdArgs,
                    CreateNoWindow = true
                },
                EnableRaisingEvents = true
            };

            packagerProcess.Exited += (sender, args) =>
            {
                taskCompletionSource.SetResult(packagerProcess.ExitCode);
                packagerProcess.Dispose();
            };

            packagerProcess.Start();

            return taskCompletionSource.Task;
        }
    }
}
