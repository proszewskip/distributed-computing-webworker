using System.Threading.Tasks;

namespace Server.Services
{
    public interface IPackagerRunner
    {
        Task<CommandRunnerResult> PackAssemblyAsync(string assemblyDirectoryPath, string outputDirectoryPath, string assemblyName);
    }
}
