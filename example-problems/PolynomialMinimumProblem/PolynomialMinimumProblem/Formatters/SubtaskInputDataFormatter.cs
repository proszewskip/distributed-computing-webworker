using DistributedComputing;

namespace PolynomialMinimumProblem.Formatters
{
    internal class SubtaskInputDataFormatter : IDataFormatter<SubtaskInput>
    {
        private readonly UniversalDataFormatter _universalDataFormatter = new UniversalDataFormatter();

        public SubtaskInput Deserialize(byte[] data)
        {
            return _universalDataFormatter.Deserialize(data) as SubtaskInput;
        }

        public byte[] Serialize(SubtaskInput data)
        {
            return _universalDataFormatter.Serialize(data);
        }
    }
}
