using System.Threading.Tasks;
using JsonApiDotNetCore.Data;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Models;

namespace Server.Services.Api
{
    /// <summary>
    ///     Customized EntityResourceService for DistributedTaskDefinitions
    ///     that ensures name uniqueness before the resources are saved
    ///     in the database.
    ///     This is done to achieve better error reporting.
    /// </summary>
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
            if (resource.Name != null) await EnsureUniqueName(resource.Name, id);

            return await base.UpdateAsync(id, resource);
        }

        private async Task EnsureUniqueName(string name, int? id = null)
        {
            var taskDefinitionExists = await _dbContext.DistributedTaskDefinitions
                .AnyAsync(taskDefinition => taskDefinition.Name == name && (id == null || taskDefinition.Id != id));

            if (taskDefinitionExists)
                throw new JsonApiException(StatusCodes.Status400BadRequest, $"A task definition with the name {name} already exists");
        }
    }
}
