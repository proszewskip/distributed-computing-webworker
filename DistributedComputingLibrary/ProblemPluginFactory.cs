using System;
using System.Reflection;


namespace DistributedComputing
{
    /// <summary>
    /// Static factory used for instantiating a class that implements IProblemPlugin.
    ///
    /// This class is required to create an instance of IProblemPlugin in the browser
    /// of distributed nodes in WebAssembly.
    /// </summary>
    public static class ProblemPluginFactory
    {
        public static IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> CreateProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>(string assemblyName, string className)
        {
            var assembly = Assembly.Load(assemblyName);
            var classType = assembly.GetType(className);
            var problemPluginInterfaceName = nameof(IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>);

            if (classType.GetInterface(problemPluginInterfaceName) == null)
                throw new ArgumentException($"Class {className} does not implement the {problemPluginInterfaceName} interface");

            return (IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>) Activator.CreateInstance(classType);
        }
    }
}
