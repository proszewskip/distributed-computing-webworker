using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using DistributedComputing;
using MaxIsomorphicSubgraphProblem.Models;
using MaxIsomorphicSubgraphProblem.Problem.Models;

namespace MaxIsomorphicSubgraphProblem.DataFormatters
{
    internal class ProblemInputDataFormatter : IDataFormatter<ProblemInput>
    {
        private readonly StringDataFormatter _stringDataFormatter = new StringDataFormatter();

        public byte[] Serialize(ProblemInput data)
        {
            throw new NotImplementedException();
        }

        public ProblemInput Deserialize(byte[] data)
        {
            var stringInput = _stringDataFormatter.Deserialize(data);

            var lines = Regex.Split(stringInput, "\r\n|\r|\n").Select(line => line.Trim().Split(',')).ToArray();

            var firstGraphVerticesCount = lines[0].Length;

            var firstGraphAdjacencyMatrix = new bool[firstGraphVerticesCount, firstGraphVerticesCount];

            for (var i = 0; i < firstGraphVerticesCount; ++i) ParseLine(i, lines[i], firstGraphAdjacencyMatrix);


            var secondGraphVerticesCount = lines[firstGraphVerticesCount].Length;

            var secondGraphAdjacencyMatrix = new bool[firstGraphVerticesCount, secondGraphVerticesCount];

            for (var i = 0; i < secondGraphVerticesCount; ++i) ParseLine(i, lines[i], secondGraphAdjacencyMatrix);

            return new ProblemInput
            {
                G = new Graph(firstGraphAdjacencyMatrix),
                H = new Graph(secondGraphAdjacencyMatrix)
            };
        }


        private void ParseLine(int row, IReadOnlyList<string> splitLine, bool[,] adjacencyMatrix)
        {
            for (var column = 0; column < splitLine.Count; column++)
                if (splitLine[column] == "1")
                    adjacencyMatrix[row, column] = true;
        }
    }
}
