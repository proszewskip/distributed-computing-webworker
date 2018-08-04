using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JsonApiDotNetCore.Data;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Services.Api
{
    public class DistributedTaskDefinitionService : EntityResourceService<DistributedTaskDefinition>
    {
        private readonly DistributedComputingDbContext _dbContext;

        public DistributedTaskDefinitionService(
            IJsonApiContext jsonApiContext,
            IEntityRepository<DistributedTaskDefinition> repository,
            ILoggerFactory loggerFactory,
            DistributedComputingDbContext dbContext)
        : base(jsonApiContext, repository, loggerFactory)
        {
            _dbContext = dbContext;
        }

        public override async Task<DistributedTaskDefinition> CreateAsync(DistributedTaskDefinition resource)
        {
            await EnsureUniqueName(resource.Name);

            return await base.CreateAsync(resource);
        }

        public override async Task<DistributedTaskDefinition> UpdateAsync(int id, DistributedTaskDefinition resource)
        {
            await EnsureUniqueName(resource.Name);

            return await base.UpdateAsync(id, resource);
        }

        private async Task EnsureUniqueName(string name)
        {
            var taskDefinitionExists = await _dbContext.DistributedTaskDefinitions
                .AnyAsync(taskDefinition => taskDefinition.Name == name);

            if (taskDefinitionExists)
            {
                throw new JsonApiException(400, $"A task definition with the name {name} already exists");
            }
        }
    }
}
