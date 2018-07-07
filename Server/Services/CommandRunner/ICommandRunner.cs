using System.Threading.Tasks;

namespace Server.Services.CommandRunner
{
    public interface ICommandRunner
    {
        Task<int> RunCommandTask(string command, string commandArgs);
    }
}
