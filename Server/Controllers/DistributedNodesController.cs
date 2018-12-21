using System;
using System.Threading.Tasks;
using JsonApiDotNetCore.Controllers;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    }
}
