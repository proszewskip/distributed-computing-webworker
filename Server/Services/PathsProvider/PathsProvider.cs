using System;
using System.IO;
using Microsoft.Extensions.Logging;
using Server.Exceptions;

namespace Server.Services
{
    public class PathsProvider : IPathsProvider
    {
        private static readonly string MonoPackagerPathVariable = "MONO_PACKAGER_PATH";
        private static readonly string TaskDefinitionsDirectoryPathVariable = "TASK_DEFINITIONS_PATH";
        private static readonly string CompiledTasksDefinitionsDirectoryPathVariable = "COMPILED_TASK_DEFINITIONS";

        private readonly ILogger<PathsProvider> _logger;

        public PathsProvider(ILogger<PathsProvider> logger)
        {
            _logger = logger;

            InitializePaths();
        }

        public string MonoPackagerPath { get; private set; }

        public string TaskDefinitionsDirectoryPath { get; private set; }

        public string CompiledTasksDefinitionsDirectoryPath { get; private set; }

        private string GetEnvironmentVariable(string variableName)
        {
            var value = Environment.GetEnvironmentVariable(variableName);

            if (string.IsNullOrEmpty(value))
            {
                _logger.LogError($"The \"{variableName}\" environment variable is not provided");
                throw new InvalidEnvironmentConfigurationException();
            }

            return value;
        }

        private string GetPathFromEnvironmentVariable(string variableName)
        {
            var relativePath = GetEnvironmentVariable(variableName);

            return Path.GetFullPath(relativePath);
        }

        private void InitializePaths()
        {
            MonoPackagerPath = GetPathFromEnvironmentVariable(MonoPackagerPathVariable);
            if (!File.Exists(MonoPackagerPath))
            {
                _logger.LogError($"The \"{MonoPackagerPathVariable}\" environment variable " +
                                 "points to a non-existing file");
                throw new InvalidEnvironmentConfigurationException();
            }

            TaskDefinitionsDirectoryPath = GetPathFromEnvironmentVariable(TaskDefinitionsDirectoryPathVariable);
            if (!Directory.Exists(TaskDefinitionsDirectoryPath))
            {
                _logger.LogError($"The \"{TaskDefinitionsDirectoryPathVariable}\" environment " +
                                 "variable points to a non-existing directory");
                throw new InvalidEnvironmentConfigurationException();
            }

            CompiledTasksDefinitionsDirectoryPath =
                GetPathFromEnvironmentVariable(CompiledTasksDefinitionsDirectoryPathVariable);
            if (!Directory.Exists(CompiledTasksDefinitionsDirectoryPath))
            {
                _logger.LogError($"The \"{CompiledTasksDefinitionsDirectoryPathVariable}\" environment " +
                                 "variable points to a non-existing directory");
                throw new InvalidEnvironmentConfigurationException();
            }
        }
    }
}
