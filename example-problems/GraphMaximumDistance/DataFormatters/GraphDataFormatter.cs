using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using DistributedComputing;
using GraphMaximumDistance.Models;

namespace GraphMaximumDistance.DataFormatters
{
    internal class GraphDataFormatter : IDataFormatter<Graph>
    {
        private readonly StringDataFormatter _stringDataFormatter = new StringDataFormatter();

        public Graph Deserialize(byte[] data)
        {
            var stringInput = _stringDataFormatter.Deserialize(data);

            var lines = Regex.Split(stringInput, "\r\n|\r|\n").Select(line => line.Trim().Split(',')).ToArray();

            var verticesCount = lines[0].Length;

            var adjacencyMatrix = new bool[verticesCount, verticesCount];

            for (var i = 0; i < lines.Length; ++i) ParseLine(i, lines[i], adjacencyMatrix);

            return new Graph(adjacencyMatrix);
        }

        public byte[] Serialize(Graph data)
        {
            throw new NotImplementedException();
        }

        private void ParseLine(int row, IReadOnlyList<string> splitLine, bool[,] adjacencyMatrix)
        {
            for (var column = 0; column < splitLine.Count; column++)
                if (splitLine[column] == "1")
                    adjacencyMatrix[row, column] = true;
        }
    }
}
