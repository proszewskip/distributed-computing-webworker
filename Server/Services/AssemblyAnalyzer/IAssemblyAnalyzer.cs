using System.Reflection;
using DistributedComputing.Common;
using Server.Models;

namespace Server.Services
{
    public interface IAssemblyAnalyzer
    {
        SubtaskInfo GetSubtaskInfo(Assembly assembly);
        ITask InstantiateTask(Assembly assembly);
    }
}
