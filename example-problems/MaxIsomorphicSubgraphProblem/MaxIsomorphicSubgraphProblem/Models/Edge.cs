using System;

namespace MaxIsomorphicSubgraphProblem.Models
{
    public interface IEdge
    {
        int From { get; }
        int To { get; }
    }

    [Serializable]
    public struct Edge : IEdge
    {
        public int From { get; }
        public int To { get; }

        public Edge(int from, int to)
        {
            From = from;
            To = to;
        }
    }
}
