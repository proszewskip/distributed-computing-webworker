using System.Threading.Tasks;

namespace Server.Services
{
    public interface ICommandRunner
    {
        Task<int> RunCommandTask(string command, string commandArgs);
    }
}
