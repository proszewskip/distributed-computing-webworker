using System.Collections.Generic;
using System.Threading.Tasks;

namespace DistributedComputing
{
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, out TSubtaskResult>
    {
        // TODO: consider having all of those methods as `async`

        TTask ParseTask(byte[] data);

        byte[] SerializeTaskResult(TTaskResult taskResult);

        IEnumerable<TSubtask> DivideTask(TTask task);

        TTaskResult JoinSubtaskResults(IEnumerable<TSubtask> subtaskResults);

        TSubtaskResult Compute(TSubtask subtask);
    }

    public interface IProblemPlugin : IProblemPlugin<object, object, object, object>
    {
    }
}
