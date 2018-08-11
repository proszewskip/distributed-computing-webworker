using System.Collections.Generic;

namespace DistributedComputing
{
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, out TSubtaskResult>
    {
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
