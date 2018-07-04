using System;
using System.Collections.Generic;
using DistributedComputing.Common;

namespace Server.Services
{
    internal class SubtaskFactory : ISubtaskFactory
    {
        public List<string> SubtasksInputs { get; } = new List<string>();

        public void CreateNewSubtask(string input)
        {
            // This method should queue instantiating a new subtask on some distributed node.
            Console.WriteLine("Creating a new subtask with data: " + input);
            SubtasksInputs.Add(input);
        }
    }
}
