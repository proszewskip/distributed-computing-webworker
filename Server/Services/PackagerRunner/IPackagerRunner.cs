using System.Threading.Tasks;
using Server.Services.CommandRunner;

namespace Server.Services
{
    public interface IPackagerRunner
    {
        Task<CommandRunnerResult> PackAssemblyAsync(string assemblyDirectoryName, string assemblyName);
    }
}
