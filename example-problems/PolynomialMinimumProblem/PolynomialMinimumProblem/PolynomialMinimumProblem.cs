using System;
using System.Collections.Generic;
using System.Linq;
using DistributedComputing;
using MathNet.Numerics;
using MathNet.Numerics.Optimization;
using PolynomialMinimumProblem.Formatters;
using PolynomialMinimumProblem.Models;

namespace PolynomialMinimumProblem
{
    public class PolynomialMinimumProblem : IProblemPlugin<TaskInput, string, SubtaskInput, SubtaskResult>
    {
        public IEnumerable<SubtaskInput> DivideTask(TaskInput task)
        {
            var length = (task.UpperBound - task.LowerBound) / task.SubtasksCount;

            var subtaskInputs = Enumerable.Range(0, task.SubtasksCount).Select(index => new SubtaskInput
            {
                LowerBound = task.LowerBound + index * length,
                UpperBound = task.LowerBound + (index + 1) * length,
                Coefficients = task.Coefficients
            }).ToList();

            return subtaskInputs;
        }

        public string JoinSubtaskResults(IEnumerable<SubtaskResult> subtaskResults)
        {
            return subtaskResults.OrderBy(subtaskResult => subtaskResult.Value).First().ToString();
        }

        public SubtaskResult Compute(SubtaskInput subtask)
        {
            var goldenSectionMinimizer = new GoldenSectionMinimizer();

            var polynomial = new Polynomial(subtask.Coefficients);

            var function = new Func<double, double>(polynomial.Evaluate);

            var objectiveFunction = ObjectiveFunction.ScalarValue(function);

            var result = goldenSectionMinimizer.FindMinimum(objectiveFunction, subtask.LowerBound, subtask.UpperBound);

            return new SubtaskResult {Point = result.MinimizingPoint, Value = result.FunctionInfoAtMinimum.Value};
        }


        public IDataFormatter<string> TaskResultDataFormatter => new StringDataFormatter();

        public IDataFormatter<SubtaskResult> SubtaskResultDataFormatter => new SubtaskResultDataFormatter();

        public IDataFormatter<TaskInput> TaskDataFormatter => new TaskInputDataFormatter();

        public IDataFormatter<SubtaskInput> SubtaskDataFormatter => new UniversalDataFormatter<SubtaskInput>();
    }
}
