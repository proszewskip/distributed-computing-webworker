namespace Server.Services
{
    public interface IDataFormatterFactory
    {
        IDataFormatter<T> Create<T>();
    }

    public class DataFormatterFactory : IDataFormatterFactory
    {
        public IDataFormatter<T> Create<T>()
        {
            return new DataFormatter<T>();
        }
    }
}
