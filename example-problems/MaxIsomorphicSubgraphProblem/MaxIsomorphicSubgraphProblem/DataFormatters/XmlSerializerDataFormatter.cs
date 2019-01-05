using System.IO;
using System.Xml.Serialization;
using DistributedComputing;

namespace MaxIsomorphicSubgraphProblem.DataFormatters
{
    internal class XmlSerializerDataFormatter<T> : IDataFormatter<T>
    {
        private readonly StringDataFormatter _stringDataFormatter = new StringDataFormatter();

        public byte[] Serialize(T data)
        {
            var xmlSerializer = new XmlSerializer(data.GetType());

            using (var textWriter = new StringWriter())
            {
                xmlSerializer.Serialize(textWriter, data);
                return _stringDataFormatter.Serialize(textWriter.ToString());
            }
        }

        public T Deserialize(byte[] data)
        {
            var dataString = _stringDataFormatter.Deserialize(data);

            var xmlSerializer = new XmlSerializer(typeof(T));
            using (var textReader = new StringReader(dataString))
            {
                return (T) xmlSerializer.Deserialize(textReader);
            }
        }
    }
}
