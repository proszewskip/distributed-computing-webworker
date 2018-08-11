using System;
using System.Reflection;


namespace DistributedComputing
{
    // TODO: Check if this signature is acceptable

    public static class ProblemPluginFactory
    {
        public static IProblemPlugin CreateProblemPlugin(string assemblyName, string className)
        {
            var assembly = Assembly.Load(assemblyName);
            var classType = assembly.GetType(className);

            if (classType.GetInterface(nameof(IProblemPlugin)) == null)
                throw new ArgumentException($"Class {className} does not implement the {nameof(IProblemPlugin)} interface");

            return (IProblemPlugin) Activator.CreateInstance(classType);
        }
    }
}
