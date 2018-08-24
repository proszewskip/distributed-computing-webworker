namespace DistributedComputing
{
    public interface IDataFormatter<T>
    {
        byte[] Serialize(T data);

        T Deserialize(byte[] data);
    }
}
