using System;
using System.Collections.Generic;
using System.Linq;

namespace MaxIsomorphicSubgraphProblem.Models
{
    public interface IGraph
    {
        int VerticesCount { get; }
        bool HasEdge(IEdge edge);
        bool HasEdge(int v1, int v2);
        IEnumerable<IEdge> GetEdges(int v);

        IEnumerable<int> GetVertices();
        IEnumerable<int> GetNeighbors(int v);

        int GetVertexDegree(int v);

        void AddEdge(int v1, int v2);
        void AddEdge(IEdge edge);
        void RemoveEdge(int v1, int v2);
        void RemoveEdge(IEdge edge);
    }

    [Serializable]
    public class Graph : IGraph
    {
        private readonly bool[,] _adjacencyMatrix;

        public Graph(int verticesCount)
        {
            VerticesCount = verticesCount;
            _adjacencyMatrix = new bool[verticesCount, verticesCount];
        }

        public Graph(bool[,] adjacencyMatrix)
        {
            _adjacencyMatrix = adjacencyMatrix;

            VerticesCount = _adjacencyMatrix.GetLength(0);
            if (VerticesCount != _adjacencyMatrix.GetLength(1))
                throw new ArgumentException("The provided matrix is not square");
        }

        public int VerticesCount { get; }

        public bool HasEdge(IEdge edge)
        {
            return HasEdge(edge.From, edge.To);
        }

        public bool HasEdge(int v1, int v2)
        {
            return _adjacencyMatrix[v1, v2];
        }

        public IEnumerable<IEdge> GetEdges(int v)
        {
            for (var v2 = 0; v2 < VerticesCount; v2++)
                if (_adjacencyMatrix[v, v2])
                    yield return new Edge(v, v2);
        }

        public IEnumerable<int> GetVertices()
        {
            for (var i = 0; i < VerticesCount; i++)
                yield return i;
        }

        public IEnumerable<int> GetNeighbors(int v)
        {
            return GetEdges(v).Select(e => e.To);
        }

        public int GetVertexDegree(int v)
        {
            return GetNeighbors(v).Count();
        }

        public void AddEdge(int v1, int v2)
        {
            _adjacencyMatrix[v1, v2] = _adjacencyMatrix[v2, v1] = true;
        }

        public void AddEdge(IEdge edge)
        {
            AddEdge(edge.From, edge.To);
        }

        public void RemoveEdge(int v1, int v2)
        {
            _adjacencyMatrix[v1, v2] = _adjacencyMatrix[v2, v1] = false;
        }

        public void RemoveEdge(IEdge edge)
        {
            RemoveEdge(edge.From, edge.To);
        }
    }
}
