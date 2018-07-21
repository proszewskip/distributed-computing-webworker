using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DistributedComputing.Common;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Services
{
    public class SubtaskFactoryFactory : ISubtaskFactoryFactory
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly ILoggerFactory _loggerFactory;

        public SubtaskFactoryFactory(DistributedComputingDbContext dbContext, ILoggerFactory loggerFactory)
        {
            _dbContext = dbContext;
            _loggerFactory = loggerFactory;
        }

        public ISubtaskFactory CreateSubtaskFactory(int distributedTaskId)
        {
            var logger = _loggerFactory.CreateLogger<SubtaskFactory>();

            return new SubtaskFactory(_dbContext, logger, distributedTaskId);
        }
    }
}
