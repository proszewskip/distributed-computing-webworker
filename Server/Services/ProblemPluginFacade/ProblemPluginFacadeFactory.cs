using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using DistributedComputing;
using Server.Exceptions;

namespace Server.Services
{
    public interface IProblemPluginFacadeFactory
    {
        IProblemPluginFacade Create(Assembly assembly);
    }

    public class ProblemPluginFacadeFactory : IProblemPluginFacadeFactory
    {
        public IProblemPluginFacade Create(Assembly assembly)
        {
            var problemPluginType = GetImplementedProblemPluginType(assembly);
            var problemPluginInterface = problemPluginType.GetInterface(typeof(IProblemPlugin<,,,>).Name);

            var genericTypes = problemPluginInterface.GenericTypeArguments;
            var pluginInstance = Activator.CreateInstance(problemPluginType);

            var typedProblemPluginFacadeType = typeof(ProblemPluginFacade<,,,>).MakeGenericType(genericTypes);

            return (IProblemPluginFacade) Activator.CreateInstance(typedProblemPluginFacadeType,
                pluginInstance);
        }

        private Type GetImplementedProblemPluginType(Assembly assembly)
        {
            var problemPluginType = typeof(IProblemPlugin<,,,>);
            List<Type> implementedProblemPluginTypes;

            try
            {
                implementedProblemPluginTypes = assembly.ExportedTypes
                    .Where(type => type.GetInterface(problemPluginType.Name) != null)
                    .ToList();
            }
            catch (TypeLoadException exception)
            {
                throw new InvalidAssemblyException("An exception occurred when loading the assembly", exception);
            }

            if (implementedProblemPluginTypes.Count == 0)
                throw new InvalidAssemblyException(
                    $"The assembly does not contain a class that implements the {problemPluginType.Name} interface");
            if (implementedProblemPluginTypes.Count > 1)
                throw new InvalidAssemblyException(
                    $"The assembly contains multiple classes that implement the {problemPluginType.Name} interface");

            var implementedProblemPluginType = implementedProblemPluginTypes.Single();

            ValidateMembers(problemPluginType, implementedProblemPluginType);

            return implementedProblemPluginType;
        }

        private void ValidateMembers(Type originalType, Type implementedType)
        {
            foreach (var member in originalType.GetMembers())
            {
                var implementedMember = implementedType.GetMember(member.Name);

                if (implementedMember == null)
                    throw new InvalidAssemblyException(
                        $"The assembly references an outdated/invalid version of DistributedComputingLibrary. Member {member.Name} is invalid. " +
                        "Please update the DistributedComputingLibrary.dll");
            }
        }
    }
}
