using DistributedComputing;
using PolynomialMinimumProblem.Models;

namespace PolynomialMinimumProblem.Formatters
{
    internal class SubtaskResultDataFormatter : IDataFormatter<SubtaskResult>
    {
        private readonly StringDataFormatter _stringDataFormatter = new StringDataFormatter();

        public SubtaskResult Deserialize(byte[] data)
        {
            var subtaskResultString = _stringDataFormatter.Deserialize(data);

            var subtaskResultMembersArray = subtaskResultString.Split(';');

            return new SubtaskResult
            {
                Value = double.Parse(subtaskResultMembersArray[0]),
                Point = double.Parse(subtaskResultMembersArray[1])
            };
        }

        public byte[] Serialize(SubtaskResult data)
        {
            var subtaskResultString = $"{data.Value};{data.Point};";

            return _stringDataFormatter.Serialize(subtaskResultString);
        }
    }
}
