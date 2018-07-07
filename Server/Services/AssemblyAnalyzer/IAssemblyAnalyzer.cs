using System.Reflection;
using Server.Models;

namespace Server.Services.AssemblyAnalyzer
{
    public interface IAssemblyAnalyzer
    {
        SubtaskInfo GetSubtaskInfo(Assembly assembly);
    }
}
