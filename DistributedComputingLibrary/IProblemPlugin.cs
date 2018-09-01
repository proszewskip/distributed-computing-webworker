using System.Collections.Generic;

namespace DistributedComputing
{
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> 
    {
        IEnumerable<TSubtask> DivideTask(TTask task);

        TTaskResult JoinSubtaskResults(IEnumerable<TSubtaskResult> subtaskResults);

        TSubtaskResult Compute(TSubtask subtask);

        IDataFormatter<TTask> TaskDataFormatter { get; }
        IDataFormatter<TTaskResult> TaskResultDataFormatter { get; }
        IDataFormatter<TSubtask> SubtaskDataFormatter { get; }
        IDataFormatter<TSubtaskResult> SubtaskResultDataFormatter { get; }
    }
}
