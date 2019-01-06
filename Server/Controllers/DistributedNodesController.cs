using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Models;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using Server.Filters;
using Server.Models;

namespace Server.Controllers
{
    /// <summary>
    /// Controller responsible for managing distributed nodes.
    /// </summary>
    [ServiceFilter(typeof(FormatErrorActionFilter))]
    [ServiceFilter(typeof(AuthorizationFilter))]
    public class DistributedNodesController : BaseJsonApiController<DistributedNode, Guid>
    {
        private readonly IResourceService<DistributedNode, Guid> _resourceService;

        public DistributedNodesController(
            IJsonApiContext jsonApiContext,
            IResourceService<DistributedNode, Guid> resourceService
        ) : base(jsonApiContext, resourceService)
        {
            _resourceService = resourceService;
        }

        [HttpGet]
        public override Task<IActionResult> GetAsync() => base.GetAsync();

        [HttpPatch("{id}")]
        public override Task<IActionResult> PatchAsync(Guid id, DistributedNode entity) =>
            base.PatchAsync(id, entity);


        [AllowAnonymous]
        [HttpPost("register")]
        public Task<IActionResult> Register()
        {
            var distributedNode = new DistributedNode
            {
                LastKeepAliveTime = DateTime.Now
            };

            return base.PostAsync(distributedNode);
        }

        [AllowAnonymous]
        [HttpPost("{id}/keep-alive")]
        public async Task<IActionResult> KeepAlive(Guid id)
        {
            var distributedNode = await _resourceService.GetAsync(id);

            if (distributedNode == null)
                return NotFound(); // TODO: use JSON API response format

            distributedNode.LastKeepAliveTime = DateTime.Now;
            await _resourceService.UpdateAsync(id, distributedNode);

            return Ok(distributedNode);
        }

        [SwaggerIgnore]
        [HttpGet("{id}")]
        public override Task<IActionResult> GetAsync(Guid id) => base.GetAsync(id);

        [SwaggerIgnore]
        public override Task<IActionResult> GetRelationshipsAsync(Guid id, string relationshipName)
        {
            return base.GetRelationshipsAsync(id, relationshipName);
        }

        [SwaggerIgnore]
        public override Task<IActionResult> GetRelationshipAsync(Guid id, string relationshipName)
        {
            return base.GetRelationshipAsync(id, relationshipName);
        }

        [SwaggerIgnore]
        public override Task<IActionResult> PostAsync([FromBody] DistributedNode entity)
        {
            return base.PostAsync(entity);
        }

        [SwaggerIgnore]
        public override Task<IActionResult> PatchRelationshipsAsync(Guid id, string relationshipName, [FromBody] List<DocumentData> relationships)
        {
            return base.PatchRelationshipsAsync(id, relationshipName, relationships);
        }

                [SwaggerIgnore]
        public override Task<IActionResult> DeleteAsync(Guid id)
        {
            return base.DeleteAsync(id);
        }
    }
}
