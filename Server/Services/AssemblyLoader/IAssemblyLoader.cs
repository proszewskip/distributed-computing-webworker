using System.Reflection;

namespace Server.Services
{
    public interface IAssemblyLoader
    {
        // TODO: consider using a stream instead of a direct file path
        Assembly LoadAssembly(string path);
    }
}
