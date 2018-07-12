using System.Threading.Tasks;

namespace Server.Services
{
    public interface ICommandRunner
    {
        Task<CommandRunnerResult> RunCommandTask(string command, string commandArgs);
    }
}
