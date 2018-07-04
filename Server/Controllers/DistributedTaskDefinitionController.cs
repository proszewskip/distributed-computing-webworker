using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Server.DTO;
using Server.Models;
using Server.Pagination;
using Server.Validation;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistributedTaskDefinitionController : ControllerBase
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly IConfiguration _configuration;


        public DistributedTaskDefinitionController(
            DistributedComputingDbContext dbContext,
            IConfiguration configuration
        )
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpGet]
        public IEnumerable<DistributedTaskDefinition> Get([FromQuery] QueryArgsBase queryArgs)
        {
            return _dbContext.DistributedTaskDefinitions
                .Paginate(queryArgs);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var foundTaskDefinition = _dbContext.DistributedTaskDefinitions
                .Include(taskDefinition => taskDefinition.SubtaskInfo)
                .Where(taskDefinition => taskDefinition.Id == id)
                .FirstOrDefault();

            if (foundTaskDefinition == null)
            {
                return NotFound();
            }

            return Ok(foundTaskDefinition);
        }

        [HttpPost]
        [ValidateModelAttribute]
        public IActionResult Create([FromForm] CreateDistributedTaskDefinitionDTO body)
        {
            // 1. Validate input data
            var taskDefinitionExists = _dbContext.DistributedTaskDefinitions.Where(taskDefinition => taskDefinition.Name == body.Name)
                .Any();

            if (taskDefinitionExists)
            {
                ModelState.TryAddModelError(nameof(body.Name), $"A task definition with name {body.Name} already exists");

                return new ValidationFailedResult(ModelState);
            }

            // 2. Analyze the DLL
            // TODO: analyze the DLL

            // 3. Add the data to the database

            // FIXME: get `subtaskInfo` from DLL analysis
            var subtaskInfo = new SubtaskInfo()
            {
                AssemblyName = "FactorialTask",
                Namespace = "FactorialTask",
                ClassName = "FactorialSubtask"
            };

            var distributedTaskDefinition = new DistributedTaskDefinition()
            {
                Name = body.Name,
                OutputDirectory = "...",
                SubtaskInfo = subtaskInfo
            };

            _dbContext.DistributedTaskDefinitions.Add(distributedTaskDefinition);
            _dbContext.SaveChanges();

            // TODO: move the DLL to an output directory

            // 4. Return the info back to the user

            return Ok(distributedTaskDefinition);
        }
    }
}
