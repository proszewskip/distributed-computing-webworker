using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using DistributedComputing;

namespace GraphMaximumDistance.DataFormatters
{
    internal class UniversalDataFormatter : IDataFormatter<object>
    {
        public byte[] Serialize(object obj)
        {
            if (obj == null) return null;

            using (var memoryStream = new MemoryStream())
            {
                var binaryFormatter = new BinaryFormatter();

                binaryFormatter.Serialize(memoryStream, obj);

                return memoryStream.ToArray();
            }
        }


        public object Deserialize(byte[] data)
        {
            using (var memoryStream = new MemoryStream())
            {
                var binaryFormatter = new BinaryFormatter();

                memoryStream.Write(data, 0, data.Length);
                memoryStream.Seek(0, SeekOrigin.Begin);

                return binaryFormatter.Deserialize(memoryStream);
            }
        }
    }
}
