using System;
using System.Reflection;

namespace Server.Services
{
    public static class AssemblyAnalyzer
    {
        public static T GetTypeFromAssembly<T>(Assembly assembly) where T : class
        {
            // TODO: check if there are multiple implementations of the interface to avoid ambiguities
            foreach (var assemblyType in assembly.GetTypes())
            {
                var typeExample = assemblyType.GetInterface(typeof(T).Name);
                if (typeExample == null)
                    continue;

                T instance = (T)assembly.CreateInstance(assemblyType.FullName);
                if (instance != null)
                {
                    return instance;
                }
            }

            throw new Exception("The assembly does not contain an class that implements the " + typeof(T).Name + " interface");
        }
    }
}
