using System;

namespace Server.Exceptions
{
    public class InvalidAssemblyException : Exception
    {
        public InvalidAssemblyException()
        {
        }

        public InvalidAssemblyException(string message) : base(message)
        {
        }

        public InvalidAssemblyException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
