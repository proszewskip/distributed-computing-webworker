using System.Collections.Generic;
using System.Linq;
using DistributedComputing;
using MaxIsomorphicSubgraphProblem.DataFormatters;
using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Comparators;
using MaxIsomorphicSubgraphProblem.Problem.Factories;
using MaxIsomorphicSubgraphProblem.Problem.Models;

namespace MaxIsomorphicSubgraphProblem
{
    public class MaxIsomorphicSubgraphProblem : IProblemPlugin<ProblemInput, string, SubtaskInput, ProblemResult>
    {
        private readonly  StringDataFormatter _stringDataFormatter = new StringDataFormatter();
        private readonly SubtaskInputDataFormatter _subtaskInputDataFormatter = new SubtaskInputDataFormatter();
        private readonly ProblemInputDataFormatter _problemInputDataFormatter = new ProblemInputDataFormatter();
        private readonly  ProblemResultDataFormatter _problemResultDataFormatter = new ProblemResultDataFormatter();

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

        public string JoinSubtaskResults(IEnumerable<ProblemResult> subtaskResults)
        {
            return subtaskResults.OrderBy(subtaskResult => subtaskResult.CV.Count).First().ToString();
        }

        public ProblemResult Compute(SubtaskInput subtask)
        {
            var problemSolverFacotry = new ExactProblemSolverFactory();

            var resultsComparator = new VertexCountResultsComparator();

            var problemSolver = problemSolverFacotry.Create(subtask, resultsComparator);

            return problemSolver.Solve();
        }

        public IDataFormatter<ProblemInput> TaskDataFormatter => _problemInputDataFormatter;
        public IDataFormatter<string> TaskResultDataFormatter => _stringDataFormatter;
        public IDataFormatter<SubtaskInput> SubtaskDataFormatter => _subtaskInputDataFormatter;
        public IDataFormatter<ProblemResult> SubtaskResultDataFormatter => _problemResultDataFormatter;
    }
}
