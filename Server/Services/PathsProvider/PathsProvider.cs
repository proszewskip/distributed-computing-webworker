using System;
using System.IO;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Exceptions;
using Server.Models;

namespace Server.Services
{
    public class PathsProvider : IPathsProvider
    {
        private readonly ILogger<PathsProvider> _logger;
        private readonly ServerConfig _serverConfig;

        public PathsProvider(
            ILogger<PathsProvider> logger,
            IOptions<ServerConfig> serverConfigAccessor)
        {
            _logger = logger;
            _serverConfig = serverConfigAccessor.Value;

            InitializePaths();
        }

        public string CompiledTasksDefinitionsDirectoryPath { get; private set; }

        private string TaskDefinitionsDirectoryPath { get; set; }

        public string GetTaskDefinitionDirectoryPath(Guid guid)
        {
            return Path.Combine(TaskDefinitionsDirectoryPath, guid.ToString());
        }

        public string GetCompiledTaskDefinitionDirectoryPath(Guid guid)
        {
            return Path.Combine(CompiledTasksDefinitionsDirectoryPath, guid.ToString());
        }

        public string GetTaskDefinitionMainAssemblyPath(Guid guid, string mainDllName)
        {
            return Path.Combine(GetTaskDefinitionDirectoryPath(guid), mainDllName);
        }

        public string GetCompiledTaskDefinitionWebPath(Guid guid)
        {
            return $"/public/task-definitions/{guid}";
        }

        private void InitializePaths()
        {
            bool invalidEnvironmentConfiguration = false;

            TaskDefinitionsDirectoryPath = GetFullPath(_serverConfig.TaskDefinitionsDirectoryPath);
            if (!Directory.Exists(TaskDefinitionsDirectoryPath))
            {
                _logger.LogError($"The \"{nameof(_serverConfig.TaskDefinitionsDirectoryPath)}\" option " +
                                 "points to a non-existing directory");
                invalidEnvironmentConfiguration = true;
            }

            CompiledTasksDefinitionsDirectoryPath =
                GetFullPath(_serverConfig.CompiledTaskDefinitionsDirectoryPath);
            if (!Directory.Exists(CompiledTasksDefinitionsDirectoryPath))
            {
                _logger.LogError($"The \"{_serverConfig.CompiledTaskDefinitionsDirectoryPath}\" option " +
                                 "points to a non-existing directory");
                invalidEnvironmentConfiguration = true;
            }

            if (invalidEnvironmentConfiguration)
            {
                throw new InvalidEnvironmentConfigurationException();
            }
        }

        private string GetFullPath(string value)
        {
            return Path.GetFullPath(value);
        }
    }
}
