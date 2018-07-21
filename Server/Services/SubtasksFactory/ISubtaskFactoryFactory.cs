using DistributedComputing.Common;

namespace Server.Services
{
    public interface ISubtaskFactoryFactory
    {
        ISubtaskFactory CreateSubtaskFactory(int distributedTaskId);
    }
}
