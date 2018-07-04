using System;
using System.Reflection;

namespace DistributedComputing.Common
{
    public static class SubtaskCreator
    {
        public static ISubtask CreateSubtask(string assemblyName, string className)
        {
            var assembly = Assembly.Load(assemblyName);
            var classType = assembly.GetType(className);

            if (classType.GetInterface(nameof(ISubtask)) == null)
                throw new ArgumentException($"Class {className} does not implement the {nameof(ISubtask)} interface");

            return (ISubtask)Activator.CreateInstance(classType);
        }
    }
}