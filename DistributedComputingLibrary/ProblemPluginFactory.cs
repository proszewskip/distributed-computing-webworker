using System;
using System.Reflection;


namespace DistributedComputing
{
    public static class ProblemPluginFactory
    {
        public static IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> CreateProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>(string assemblyName, string className)
            where TTask : class
            where TTaskResult : class
            where TSubtask : class
            where TSubtaskResult : class
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
