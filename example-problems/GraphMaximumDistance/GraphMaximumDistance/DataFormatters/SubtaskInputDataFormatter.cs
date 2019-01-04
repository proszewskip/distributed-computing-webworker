using DistributedComputing;
using GraphMaximumDistance.Models;

namespace GraphMaximumDistance.DataFormatters
{
    internal class SubtaskInputDataFormatter : IDataFormatter<SubtaskInput>
    {
        private readonly UniversalDataFormatter _universalDataFormatter = new UniversalDataFormatter();

        public byte[] Serialize(SubtaskInput data)
        {
            return _universalDataFormatter.Serialize(data);
        }

        public SubtaskInput Deserialize(byte[] data)
        {
            return (SubtaskInput) _universalDataFormatter.Deserialize(data);
        }
    }
}
