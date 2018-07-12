using System.Diagnostics;
using System.Threading.Tasks;

namespace Server.Services
{
    public class CommandRunner : ICommandRunner
    {
        public Task<CommandRunnerResult> RunCommandTask(string command, string commandArgs)
        {
            var taskCompletionSource = new TaskCompletionSource<CommandRunnerResult>();

            var packagerProcess = new Process
            {
                StartInfo =
                {
                    FileName = command,
                    Arguments = commandArgs,
                    CreateNoWindow = true,
                    RedirectStandardError = true,
                    RedirectStandardOutput = true
                },
                EnableRaisingEvents = true
            };

            packagerProcess.Exited += (sender, args) =>
            {
                string standardOutput = packagerProcess.StandardOutput.ReadToEnd();
                string standardError = packagerProcess.StandardError.ReadToEnd();

                var commandRunnerResult = new CommandRunnerResult()
                {
                    StandardOutput = standardOutput,
                    StandardError = standardError
                };

                taskCompletionSource.SetResult(commandRunnerResult);
                packagerProcess.Dispose();
            };

            packagerProcess.Start();

            return taskCompletionSource.Task;
        }
    }
}
