using System;
using System.Reflection;

namespace DistributedComputing
{
    /// <summary>
    ///     Static factory used for running computations from JavaScript.
    ///     This class is required to create an instance of IProblemPlugin in the browser
    ///     of distributed nodes in WebAssembly.
    /// </summary>
    public static class ProblemPluginFactory
    {
        public static byte[] ComputeTask(string assemblyName,
            string className, byte[] subtaskData)
        {
            var problemPluginFacade =
                CreateProblemPluginFacade(assemblyName,
                    className);

            var result = problemPluginFacade.Compute(subtaskData);

            return result;
        }

        private static IProblemPluginFacade CreateProblemPluginFacade(string assemblyName, string className)
        {
            var assembly = Assembly.Load(assemblyName);

            var problemPluginType = assembly.GetType(className);
            var problemPluginInterfaceName = typeof(IProblemPlugin<,,,>).Name;

            var problemPluginInterface = problemPluginType.GetInterface(problemPluginInterfaceName);

            if (problemPluginInterface == null)
                throw new ArgumentException(
                    $"Class {className} does not implement the {problemPluginInterfaceName} interface");

            var genericTypes = problemPluginInterface.GenericTypeArguments;
            var pluginInstance = Activator.CreateInstance(problemPluginType);

            var typedProblemPluginFacadeType = typeof(ProblemPluginFacade<,,,>).MakeGenericType(genericTypes);

            return (IProblemPluginFacade) Activator.CreateInstance(typedProblemPluginFacadeType,
                pluginInstance);
        }
    }
}
