using System;
using DistributedComputing.Common;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Services
{
    internal class SubtaskFactory : ISubtaskFactory
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly int _distributedTaskId;
        private readonly ILogger<SubtaskFactory> _logger;
        private int _subtaskSequenceNumber;

        public SubtaskFactory(DistributedComputingDbContext dbContext, ILogger<SubtaskFactory> logger,
            int distributedTaskId)
        {
            _dbContext = dbContext;
            _logger = logger;
            _distributedTaskId = distributedTaskId;
        }

        public void CreateNewSubtask(string input)
        {
            var subtaskToken = Guid.NewGuid().ToString();

            var subtask = new Subtask
            {
                SequenceNumber = _subtaskSequenceNumber,
                Token = subtaskToken,
                DistributedTaskId = _distributedTaskId,
                InputData = input,
                Result = null,
                Status = SubtaskStatus.WaitingForExecution
            };

            _subtaskSequenceNumber++;

            _logger.LogDebug($"Creating a subtask {_subtaskSequenceNumber} for task with id {_distributedTaskId}");

            _dbContext.Add(subtask);
        }
    }
}
