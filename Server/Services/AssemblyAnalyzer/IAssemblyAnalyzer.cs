using System.Reflection;
using Server.Models;

namespace Server.Services
{
    public interface IAssemblyAnalyzer
    {
        SubtaskInfo GetSubtaskInfo(Assembly assembly);
    }
}
