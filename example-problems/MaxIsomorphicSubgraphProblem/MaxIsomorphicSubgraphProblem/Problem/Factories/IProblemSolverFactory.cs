using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Comparators;
using MaxIsomorphicSubgraphProblem.Problem.Solvers;

namespace MaxIsomorphicSubgraphProblem.Problem.Factories
{
    internal interface IProblemSolverFactory
    {
        IProblemSolver Create(SubtaskInput problemInput, IProblemResultsComparator resultsComparator);
    }
}
