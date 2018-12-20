namespace DistributedComputing
{
    /// <summary>
    ///     Used for data serialization and deserialization.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IDataFormatter<T>
    {
        byte[] Serialize(T data);

        T Deserialize(byte[] data);
    }
}
