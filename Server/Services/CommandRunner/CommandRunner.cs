using System.Diagnostics;
using System.Threading.Tasks;

namespace Server.Services.CommandRunner
{
    public class CommandRunner : ICommandRunner
    {
        public Task<int> RunCommandTask(string command, string commandArgs)
        {
            var taskCompletionSource = new TaskCompletionSource<int>();

            var packagerProcess = new Process
            {
                StartInfo =
                {
                    FileName = command,
                    Arguments = commandArgs,
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
