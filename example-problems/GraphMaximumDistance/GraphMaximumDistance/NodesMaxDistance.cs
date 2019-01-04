using System;
using System.Linq;
using GraphMaximumDistance.Models;

namespace GraphMaximumDistance
{
    public static class NodesMaxDistance
    {
        public static NodesDistance GetNodesMaxDistance(Graph graph, int start)
        {
            var distances = Enumerable.Repeat(int.MaxValue, graph.VerticesCount).ToArray();

            distances[start] = 0;

            var verticesLeft = Enumerable.Range(0, graph.VerticesCount).ToList();

            while (verticesLeft.Count > 0)
            {
                var u = verticesLeft.OrderBy(index => distances[index]).First();
                verticesLeft.Remove(u);

                foreach (var v in graph.GetNeighbors(u))
                    if (distances[v] > distances[u] + 1)
                        distances[v] = distances[u] + 1;
            }




            var highestDistance = distances.Max(distance => distance == int.MaxValue ? int.MinValue : distance);
            var mostDistantNode = Array.IndexOf(distances, highestDistance);

            return new NodesDistance
            {
                InitialNode = start,
                Distance = highestDistance,
                FinalNode = mostDistantNode
            };
        }
    }
}
