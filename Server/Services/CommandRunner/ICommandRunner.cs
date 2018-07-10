using System.Threading.Tasks;

namespace Server.Services.CommandRunner
{
    public interface ICommandRunner
    {
        Task<CommandRunnerResult> RunCommandTask(string command, string commandArgs);
    }
}
