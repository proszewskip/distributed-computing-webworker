using System.Collections.Generic;

namespace DistributedComputing
{
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, out TSubtaskResult>
        where TTask : class
        where TTaskResult : class
        where TSubtask : class
        where TSubtaskResult : class
    {
        TTask ParseTask(byte[] data);

        byte[] SerializeTaskResult(TTaskResult taskResult);

        IEnumerable<TSubtask> DivideTask(TTask task);

        TTaskResult JoinSubtaskResults(IEnumerable<TSubtask> subtaskResults);

        TSubtaskResult Compute(TSubtask subtask);
    }
}
