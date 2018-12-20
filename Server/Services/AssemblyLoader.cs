using System.IO;
using System.Reflection;

namespace Server.Services
{
    /// <summary>
    ///     Loads assemblies from the file system.
    /// </summary>
    public interface IAssemblyLoader
    {
        // TODO: consider using a stream instead of a direct file path
        Assembly LoadAssembly(string path);
    }

    public class AssemblyLoader : IAssemblyLoader
    {
        public Assembly LoadAssembly(string path)
        {
            return Assembly.Load(File.ReadAllBytes(path));
        }
    }
}
