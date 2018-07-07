using Moq;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using System.IO;

using Server.Services;
using Server.Services.CommandRunner;
using System.Threading.Tasks;

namespace Server.Services.Tests
{
    public class PackagerRunnerTests
    {
        private readonly PackagerRunner _packagerRunner;

        private readonly string _monoPackagerPath = "path";
        private readonly string _inputDirectory = "input";
        private readonly string _outputDirectory = "output";

        private string _command;
        private string _commandArgs;

        public PackagerRunnerTests()
        {
            var _commandRunnerMock = new Mock<ICommandRunner>();
            _commandRunnerMock.Setup(e => e.RunCommandTask(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(5)
                .Callback((string command, string commandArgs) =>
                {
                    _command = command;
                    _commandArgs = commandArgs;
                });

            _packagerRunner = new PackagerRunner(
                _monoPackagerPath,
                _inputDirectory,
                _outputDirectory,
                _commandRunnerMock.Object
            );
        }

        [Test]
        public async Task PackAssemblyAsync_Should_UseCorrectCommand()
        {
            await _packagerRunner.PackAssemblyAsync("assembly", "b.dll");

            Assert.AreEqual(_command, "mono");
        }

        [Test]
        public async Task PackAssemblyAsync_Should_UseCorrectCommandArguments()
        {
            var assemblyPath = "assembly";
            var assemblyName = "b.dll";
            await _packagerRunner.PackAssemblyAsync(assemblyPath, assemblyName);

            Assert.AreEqual(_commandArgs, string.Join(" ", new List<string>() {
                _monoPackagerPath,
                $"-prefix={Path.Join(_inputDirectory, assemblyPath)}",
                $"-out={Path.Join(_outputDirectory, assemblyPath)}",
                assemblyName
            }));
        }
    }
}
