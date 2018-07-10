using System.Reflection;

namespace Server.Services
{
    public class AssemblyLoader : IAssemblyLoader
    {
        public Assembly LoadAssembly(string path)
        {
            return Assembly.LoadFile(path);
        }
    }
}
