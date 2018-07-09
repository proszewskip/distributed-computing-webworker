using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Pagination;
using Server.Validation;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistributedTaskController : ControllerBase
    {
        private readonly DistributedComputingDbContext _dbContext;


        public DistributedTaskController(
            DistributedComputingDbContext dbContext
        )
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IEnumerable<DistributedTask> Get([FromQuery] QueryArgsBase queryArgs)
        {
            return _dbContext.DistributedTasks
                .Paginate(queryArgs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var foundTask = await _dbContext.DistributedTasks
                .Include(task => task.DistributedTaskDefinition)
                .Include(task => task.Subtasks)
                .FirstOrDefaultAsync(task => task.Id == id);

            if (foundTask == null) return NotFound();

            return Ok(foundTask);
        }

        // POST: api/DistributedTask
        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Create([FromForm] CreateDistributedTaskDTO body)
        {
            // FIXME: handle errors

            // 1. Validate input data
            var taskDefinitionExists = await _dbContext.DistributedTaskDefinitions
                .AnyAsync(taskDefinition => taskDefinition.Id == body.DistributedTaskDefinitionId);

            if (!taskDefinitionExists)
            {
                ModelState.TryAddModelError(
                    nameof(body.DistributedTaskDefinitionId),
                    $"A task definition with id {body.DistributedTaskDefinitionId} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            var taskExists = await _dbContext.DistributedTasks.AnyAsync(task => task.Name == body.Name);

            if (taskExists)
            {
                ModelState.TryAddModelError(
                    nameof(body.Name),
                    $"A task with name {body.Name} already exists."
                );

                return new ValidationFailedResult(ModelState);
            }


            // TODO: 2. Create subtasks

            // TODO: 3. Run subtasks

            // TODO: Include subtasks
            // 4. Add the data to the database

            var distributedTask = new DistributedTask
            {
                Name = body.Name,
                Priority = body.Priority,
                DistributedTaskDefinitionId = body.DistributedTaskDefinitionId,
                InputData = body.InputData,
                Status = DistributedTaskStatus.InProgress
            };

            await _dbContext.DistributedTasks.AddAsync(distributedTask);

            await _dbContext.SaveChangesAsync();

            // 5. Return the info back to the user

            return Ok(distributedTask);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] ModifyDistributedTaskDTO body)
        {
            // 1. Validate input data

            var modifiedTask = await _dbContext.DistributedTasks.FirstOrDefaultAsync(task => task.Id == id);

            if (modifiedTask == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A task with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            var taskExists = await _dbContext.DistributedTasks.AnyAsync(task => task.Name == body.Name);

            if (taskExists)
            {
                ModelState.TryAddModelError(
                    nameof(body.Name),
                    $"A task definition with name {body.Name} already exists."
                );

                return new ValidationFailedResult(ModelState);
            }

            // 2. Update task

            modifiedTask.Name = body.Name;

            await _dbContext.SaveChangesAsync();

            // 5. Return the info back to the user

            return Ok(modifiedTask);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // 1. Validate input data

            var modifiedTask = await _dbContext.DistributedTasks.FirstOrDefaultAsync(task => task.Id == id);

            if (modifiedTask == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A task with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            //TODO: update ModelBuilder to delete subtasks when task is deleted
            // 2. Remove task
            _dbContext.DistributedTasks.Remove(modifiedTask);

            await _dbContext.SaveChangesAsync();

            // 3. Return the info back to the user

            return Ok();
        }
    }
}
