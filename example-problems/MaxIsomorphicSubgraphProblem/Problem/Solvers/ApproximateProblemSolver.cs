using System;
using System.Collections.Generic;
using System.Linq;
using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Comparators;

namespace MaxIsomorphicSubgraphProblem.Problem.Solvers
{
    internal class ApproximateProblemSolver : IProblemSolver
    {
        private readonly SubtaskInput _problemInput;
        private readonly IProblemResultsComparator _resultsComparator;
        private readonly IComparer<int> _vertexComparerInG;
        private readonly IComparer<int> _vertexComparerInH;


        public ApproximateProblemSolver(SubtaskInput problemInput, IProblemResultsComparator resultsComparator)
        {
            _problemInput = problemInput;
            _resultsComparator = resultsComparator;

            var verticesDegreesInG = problemInput.G.GetVertices().Select(v => problemInput.G.GetVertexDegree(v))
                .ToArray();
            var verticesDegreesInH = problemInput.H.GetVertices().Select(v => problemInput.H.GetVertexDegree(v))
                .ToArray();

            _vertexComparerInG = new DescendingVerticesDegreeComparer<int>(verticesDegreesInG);
            _vertexComparerInH = new DescendingVerticesDegreeComparer<int>(verticesDegreesInH);
        }

        public ProblemResult Solve()
        {
            var bestProblemResults = new ProblemResult
            {
                CV = new List<int>(),
                CU = new List<int>(),
                SubgraphEdges = 0
            };

            var greedySolver =
                new GreedyProblemSolver(_problemInput, _problemInput.V, _problemInput.U, bestProblemResults,
                    _resultsComparator,
                    _vertexComparerInG, _vertexComparerInH);

            return bestProblemResults;
        }

        private class GreedyProblemSolver : IProblemSolver
        {
            private readonly bool[] _closedU;
            private readonly bool[] _closedV;

            private readonly ProblemResult _currentProblemResult;
            private readonly SortedSet<int> _neighborsU;
            private readonly SortedSet<int> _neighborsV;
            private readonly SubtaskInput _problemInput;
            private readonly IProblemResultsComparator _resultsComparator;

            public GreedyProblemSolver(
                SubtaskInput problemInput,
                int initialV,
                int initialU,
                ProblemResult bestProblemResult,
                IProblemResultsComparator resultsComparator,
                IComparer<int> vertexComparerInG,
                IComparer<int> vertexComparerInH
            )
            {
                _problemInput = problemInput;
                _resultsComparator = resultsComparator;
                BestProblemResult = bestProblemResult;

                var n = _problemInput.G.VerticesCount;
                var m = _problemInput.H.VerticesCount;

                _currentProblemResult = new ProblemResult
                {
                    CV = new List<int>(n),
                    CU = new List<int>(m),
                    SubgraphEdges = 0
                };

                _neighborsV = new SortedSet<int>(vertexComparerInG);
                _neighborsU = new SortedSet<int>(vertexComparerInH);

                _neighborsV.Add(initialV);
                _neighborsU.Add(initialU);

                _closedV = new bool[n];
                _closedV[initialV] = true;

                _closedU = new bool[m];
                _closedU[initialU] = true;
            }

            private IGraph G => _problemInput.G;
            private IGraph H => _problemInput.H;

            private ProblemResult BestProblemResult { get; set; }

            private List<int> CV => _currentProblemResult.CV;
            private List<int> CU => _currentProblemResult.CU;

            public ProblemResult Solve()
            {
                SolveGreedy();

                if (IsCurrentMappingBetterThanCurrentlyBest())
                    BestProblemResult = new ProblemResult
                    {
                        CV = new List<int>(CV),
                        CU = new List<int>(CU),
                        SubgraphEdges = _currentProblemResult.SubgraphEdges
                    };

                return BestProblemResult;
            }

            private void SolveGreedy()
            {
                var neighborsSum = _neighborsV.Count + _neighborsU.Count - 2;

                for (var currentDiagonal = 0; currentDiagonal <= neighborsSum; ++currentDiagonal)
                {
                    var j = Math.Min(currentDiagonal, _neighborsU.Count - 1);
                    var i = currentDiagonal - j;

                    var maxI = Math.Min(_neighborsV.Count - 1, currentDiagonal);

                    while (i <= maxI)
                    {
                        var v = _neighborsV.ElementAt(i);
                        var u = _neighborsU.ElementAt(j);

                        i++;
                        j--;

                        var (maintainsIsomorphism, edgesAddedAfterExpansion) =
                            CanExpandAndMaintainIsomorphism(v, u);

                        if (!maintainsIsomorphism) continue;

                        _neighborsV.Remove(v);
                        _neighborsU.Remove(u);

                        CV.Add(v);
                        CU.Add(u);

                        var newNeighborsInG = G.GetNeighbors(v)
                            .Where(x => !_closedV[x])
                            .ToList();
                        var newNeighborsInH = H.GetNeighbors(u)
                            .Where(x => !_closedU[x])
                            .ToList();

                        foreach (var x in newNeighborsInG)
                        {
                            _closedV[x] = true;
                            _neighborsV.Add(x);
                        }

                        foreach (var x in newNeighborsInH)
                        {
                            _closedU[x] = true;
                            _neighborsU.Add(x);
                        }

                        _currentProblemResult.SubgraphEdges += edgesAddedAfterExpansion;

                        SolveGreedy();
                        return;
                    }
                }
            }

            private bool IsCurrentMappingBetterThanCurrentlyBest()
            {
                return _resultsComparator.IsBetter(_currentProblemResult, BestProblemResult);
            }

            private (bool, int) CanExpandAndMaintainIsomorphism(int v, int u)
            {
                var edgesAddedAfterExpansion = 0;

                for (var i = 0; i < CV.Count; i++)
                {
                    var hasEdgeInG = G.HasEdge(CV[i], v);
                    var hasEdgeInH = H.HasEdge(CU[i], u);

                    if (hasEdgeInG != hasEdgeInH)
                        return (false, 0);

                    if (hasEdgeInG)
                        edgesAddedAfterExpansion++;
                }

                return (true, edgesAddedAfterExpansion);
            }
        }
    }
}
