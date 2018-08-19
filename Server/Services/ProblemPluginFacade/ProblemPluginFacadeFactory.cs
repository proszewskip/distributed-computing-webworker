using System;
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
        private readonly IDataFormatterFactory _dataFormatterFactory;

        public ProblemPluginFacadeFactory(IDataFormatterFactory dataFormatterFactory)
        {
            _dataFormatterFactory = dataFormatterFactory;
        }

        public IProblemPluginFacade Create(Assembly assembly)
        {
            var problemPluginType = GetImplementedProblemPluginType(assembly);
            var problemPluginInterface = problemPluginType.GetInterface(typeof(IProblemPlugin<,,,>).Name);

            var genericTypes = problemPluginInterface.GenericTypeArguments;
            var pluginInstance = Activator.CreateInstance(problemPluginType);

            var typedProblemPluginFacadeType = typeof(ProblemPluginFacade<,,,>).MakeGenericType(genericTypes);

            return (IProblemPluginFacade)Activator.CreateInstance(typedProblemPluginFacadeType, _dataFormatterFactory,
                pluginInstance);
        }

        private Type GetImplementedProblemPluginType(Assembly assembly)
        {
            var problemPluginType = typeof(IProblemPlugin<,,,>);
            var implementedProblemPluginTypes = assembly.ExportedTypes
                .Where(type => type.GetInterface(problemPluginType.Name) != null)
                .ToList();

            if (implementedProblemPluginTypes.Count == 0)
                throw new InvalidAssemblyException($"The assembly does not contain a class that implements the {problemPluginType.Name} interface");
            if (implementedProblemPluginTypes.Count > 1)
                throw new InvalidAssemblyException($"The assembly contains multiple classes that implement the {problemPluginType.Name} interface");

            return implementedProblemPluginTypes.Single();
        }
    }
}
