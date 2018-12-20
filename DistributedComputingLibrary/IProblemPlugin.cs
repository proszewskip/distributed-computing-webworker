using System.Collections.Generic;

namespace DistributedComputing
{
    /// <summary>
    ///     Class that constitutes a single problem that is supposed to be computed on distributed nodes.
    /// </summary>
    /// <typeparam name="TTask">The type of input data</typeparam>
    /// <typeparam name="TTaskResult">The type of the problem results</typeparam>
    /// <typeparam name="TSubtask">The type of a single subtask input data</typeparam>
    /// <typeparam name="TSubtaskResult">The type of a single subtask results</typeparam>
    public interface IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult>
    {
        /// <summary>
        ///     Used for serializing and deserializing task input data.
        /// </summary>
        IDataFormatter<TTask> TaskDataFormatter { get; }

        /// <summary>
        ///     Used for serializing and deserializing task results.
        /// </summary>
        IDataFormatter<TTaskResult> TaskResultDataFormatter { get; }

        /// <summary>
        ///     Used for serializing and deserializing subtask input data.
        /// </summary>
        IDataFormatter<TSubtask> SubtaskDataFormatter { get; }

        /// <summary>
        ///     Used for serializing and deserializing subtask results.
        /// </summary>
        IDataFormatter<TSubtaskResult> SubtaskResultDataFormatter { get; }

        /// <summary>
        ///     Splits the task into input data for possibly multiple subtasks.
        ///     Input data for each subtask will be deserialized and serialized using SubtaskDataFormatter.
        /// </summary>
        /// <param name="task"></param>
        /// <returns></returns>
        IEnumerable<TSubtask> DivideTask(TTask task);

        /// <summary>
        ///     Joins possibly multiple subtasks results into a single task result.
        ///     The task result will be serialized using TaskDataFormatter.
        /// </summary>
        /// <param name="subtaskResults"></param>
        /// <returns></returns>
        TTaskResult JoinSubtaskResults(IEnumerable<TSubtaskResult> subtaskResults);

        /// <summary>
        ///     Computes a single subtask given its input data.
        ///     The subtask results will be serialized and deserialized using SubtaskResultDataFormatter.
        /// </summary>
        /// <param name="subtask"></param>
        /// <returns></returns>
        TSubtaskResult Compute(TSubtask subtask);
    }
}
