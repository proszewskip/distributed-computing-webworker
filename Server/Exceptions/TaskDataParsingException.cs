using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Exceptions
{
    public class TaskDataParsingException : Exception
    {
        private const string DefaultMessage = "Cannot parse task data";

        public TaskDataParsingException() : base(DefaultMessage)
        {
        }

        public TaskDataParsingException(Exception innerException) : base(DefaultMessage, innerException)
        {
        }

        public TaskDataParsingException(string message) : base(message)
        {
        }

        public TaskDataParsingException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
