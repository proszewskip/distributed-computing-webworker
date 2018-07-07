using System;
using System.Reflection;
using System.Linq;
using System.Collections.Generic;
using NUnit.Framework;
using Moq;

using DistributedComputing.Common;
using Server.Services.AssemblyAnalyzer;

namespace Server.Services.AssemblyAnalyzer.Tests
{
    public class AssemblyAnalyzerTests
    {
        private AssemblyAnalyzer _assemblyAnalyzer;

        private class ExampleSubtask : ISubtask
        {
            public string Perform(string input)
            {
                throw new NotImplementedException();
            }
        }

        private Mock<Assembly> GetAssemblyMock(string assemblyName, List<Type> exportedTypes)
        {
            var assemblyMock = new Mock<Assembly>();
            assemblyMock.Setup(e => e.ExportedTypes).Returns(exportedTypes);
            assemblyMock.Setup(e => e.FullName).Returns(assemblyName);

            return assemblyMock;
        }

        public AssemblyAnalyzerTests()
        {
            _assemblyAnalyzer = new AssemblyAnalyzer();
        }

        [Test]
        public void GetSubtaskInfo_Returns_CorrectValues()
        {
            var assemblyName = "Test";
            var exportedTypes = new List<Type>() { typeof(ExampleSubtask) };
            var assemblyMock = GetAssemblyMock(assemblyName, exportedTypes);

            var subtaskInfo = _assemblyAnalyzer.GetSubtaskInfo(assemblyMock.Object);

            Assert.AreEqual(subtaskInfo.AssemblyName, assemblyName);
            Assert.AreEqual(subtaskInfo.ClassName, nameof(ExampleSubtask));
            Assert.AreEqual(subtaskInfo.Namespace, typeof(ExampleSubtask).Namespace);
        }

        [Test]
        public void GetSubtaskInfo_ThrowsException_When_AssemblyDoesNotImplementSubtask()
        {
            var assemblyMock = GetAssemblyMock("Test", new List<Type>());

            Assert.Throws<Exception>(() => _assemblyAnalyzer.GetSubtaskInfo(assemblyMock.Object));
        }

        [Test]
        public void GetSubtaskInfo_ThrowsException_When_AssemblyImplementsTwoSubtasks()
        {
            var exportedTypes = new List<Type> {
                typeof(ExampleSubtask),
                typeof(ExampleSubtask)
            };
            var assemblyMock = GetAssemblyMock("Test", exportedTypes);

            Assert.Throws<Exception>(() => _assemblyAnalyzer.GetSubtaskInfo(assemblyMock.Object));
        }
    }
}
