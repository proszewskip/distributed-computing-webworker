using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Comparators;
using MaxIsomorphicSubgraphProblem.Problem.Solvers;

namespace MaxIsomorphicSubgraphProblem.Problem.Factories
{
    internal class ExactProblemSolverFactory : IProblemSolverFactory
    {
        public IProblemSolver Create(SubtaskInput problemInput, IProblemResultsComparator resultsComparator)
        {
            return new ExactProblemSolver(problemInput, resultsComparator);
        }
    }
}
