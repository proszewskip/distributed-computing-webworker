using System.Threading.Tasks;

namespace Server.Services.CommandRunner
{
    internal interface ICommandRunner
    {
        Task<int> RunCommandTask(string command, string commandArgs);
    }
}
