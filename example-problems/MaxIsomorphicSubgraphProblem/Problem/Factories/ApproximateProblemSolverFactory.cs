using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Comparators;
using MaxIsomorphicSubgraphProblem.Problem.Solvers;

namespace MaxIsomorphicSubgraphProblem.Problem.Factories
{
    internal class ApproximateProblemSolverFactory : IProblemSolverFactory
    {
        public IProblemSolver Create(SubtaskInput problemInput, IProblemResultsComparator resultsComparator)
        {
            return new ApproximateProblemSolver(problemInput, resultsComparator);
        }
    }
}
