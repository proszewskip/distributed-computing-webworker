using System.Collections.Generic;
using System.Linq;
using DistributedComputing;
using MaxIsomorphicSubgraphProblem.DataFormatters;
using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Comparators;
using MaxIsomorphicSubgraphProblem.Problem.Factories;

namespace MaxIsomorphicSubgraphProblem
{
    public class MaxIsomorphicSubgraphProblem : IProblemPlugin<ProblemInput, string, SubtaskInput, ProblemResult>
    {
        public IEnumerable<SubtaskInput> DivideTask(ProblemInput task)
        {
            return Enumerable.Range(0, task.G.VerticesCount).SelectMany(l => Enumerable.Range(0, task.H.VerticesCount),
                (l, r) => new SubtaskInput
                {
                    G = task.G,
                    H = task.H,
                    V = l,
                    U = r
                });
        }

        public ProblemResult Compute(SubtaskInput subtask)
        {
            var problemSolverFactory = new ExactProblemSolverFactory();

            var resultsComparator = new VertexCountResultsComparator();

            var problemSolver = problemSolverFactory.Create(subtask, resultsComparator);

            return problemSolver.Solve();
        }

        public string JoinSubtaskResults(IEnumerable<ProblemResult> subtaskResults)
        {
            return subtaskResults.OrderByDescending(subtaskResult => subtaskResult.CV.Count).First().ToString();
        }

        public IDataFormatter<ProblemInput> TaskDataFormatter => new ProblemInputDataFormatter();
        public IDataFormatter<string> TaskResultDataFormatter => new StringDataFormatter();
        public IDataFormatter<SubtaskInput> SubtaskDataFormatter => new UniversalDataFormatter<SubtaskInput>();
        public IDataFormatter<ProblemResult> SubtaskResultDataFormatter => new XmlSerializerDataFormatter<ProblemResult>();
    }
}
