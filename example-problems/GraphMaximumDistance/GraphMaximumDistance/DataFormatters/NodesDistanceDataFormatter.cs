using DistributedComputing;
using GraphMaximumDistance.Models;

namespace GraphMaximumDistance.DataFormatters
{
    internal class NodesDistanceDataFormatter : IDataFormatter<NodesDistance>
    {
        private readonly XmlSerializerDataFormatter<NodesDistance> _xmlSerializerDataFormatter =
            new XmlSerializerDataFormatter<NodesDistance>();

        public NodesDistance Deserialize(byte[] data)
        {
            return _xmlSerializerDataFormatter.Deserialize(data);
        }

        public byte[] Serialize(NodesDistance data)
        {
            return _xmlSerializerDataFormatter.Serialize(data);
        }
    }
}
