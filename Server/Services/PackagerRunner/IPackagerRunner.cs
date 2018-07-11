using System.Threading.Tasks;

namespace Server.Services
{
    public interface IPackagerRunner
    {
        Task<int> PackAssemblyAsync(string assemblyDirectoryName, string assemblyName);
    }
}