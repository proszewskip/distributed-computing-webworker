using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Exceptions
{
    public class TaskDivisionException : Exception
    {
        private const string DefaultMessage = "Cannot divide task into subtasks";

        public TaskDivisionException() : base(DefaultMessage)
        {
        }

        public TaskDivisionException(Exception innerException) : base(DefaultMessage, innerException)
        {
        }

        public TaskDivisionException(string message) : base(message)
        {
        }

        public TaskDivisionException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
