using System.Collections.Generic;

namespace DistributedComputing
{
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>
    {
        TTask ParseTask(byte[] data);

        byte[] SerializeTaskResult(TTaskResult taskResult);

        IEnumerable<TSubtask> DivideTask(TTask task);

        TTaskResult JoinSubtaskResults(IEnumerable<TSubtaskResult> subtaskResults);

        TSubtaskResult Compute(TSubtask subtask);
    }
}
