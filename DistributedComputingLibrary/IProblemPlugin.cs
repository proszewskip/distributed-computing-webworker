using System.Collections.Generic;

namespace DistributedComputing
{
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>
    {
        IEnumerable<TSubtask> DivideTask(TTask task);

        TTaskResult JoinSubtaskResults(IEnumerable<TSubtaskResult> subtaskResults);

        TSubtaskResult Compute(TSubtask subtask);

        IBinarySerializer<TTask> TaskBinarySerializer { get; }
        IBinarySerializer<TTaskResult> TaskResultBinarySerializer { get; }
        IBinarySerializer<TSubtask> SubtaskBinarySerializer { get; }
        IBinarySerializer<TSubtaskResult> SubtaskResultBinarySerializer { get; }
    }
}
