using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;

namespace Server.Services.Tests
{
    public class PackagerRunnerTests
    {
        private const string MonoPackagerPath = "path";
        private const string InputDirectory = "input";
        private const string OutputDirectory = "output";
        private readonly IPackagerRunner _packagerRunner;

        private string _command;
        private string _commandArgs;

        public PackagerRunnerTests()
        {
            var commandRunnerMock = new Mock<ICommandRunner>();
            commandRunnerMock.Setup(e => e.RunCommandTask(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new CommandRunnerResult {StandardError = "error", StandardOutput = "output"})
                .Callback((string command, string commandArgs) =>
                {
                    _command = command;
                    _commandArgs = commandArgs;
                });

            var pathsProvider = new Mock<IPathsProvider>();
            pathsProvider.Setup(e => e.CompiledTasksDefinitionsDirectoryPath)
                .Returns(OutputDirectory);
            pathsProvider.Setup(e => e.MonoPackagerPath)
                .Returns(MonoPackagerPath);

            _packagerRunner = new PackagerRunner(pathsProvider.Object, commandRunnerMock.Object);
        }

        [Test]
        public async Task PackAssemblyAsync_Should_UseCorrectCommand()
        {
            await _packagerRunner.PackAssemblyAsync(InputDirectory, OutputDirectory, "b.dll");

            Assert.AreEqual(_command, "mono");
        }

        [Test]
        public async Task PackAssemblyAsync_Should_UseCorrectCommandArguments()
        {
            var assemblyName = "b.dll";
            await _packagerRunner.PackAssemblyAsync(InputDirectory, OutputDirectory, assemblyName);

            Assert.AreEqual(_commandArgs, string.Join(" ", new List<string>
            {
                MonoPackagerPath,
                $"-prefix={InputDirectory}",
                $"-out={OutputDirectory}",
                assemblyName
            }));
        }
    }
}
