using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.DTO;
using Server.Models;
using Server.Pagination;
using Server.Services;
using Server.Validation;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubtaskController : Controller
    {
        private readonly DistributedComputingDbContext _dbContext;
        private readonly ISubtaskFactoryFactory _subtaskFactoryFactory;


        public SubtaskController(
            DistributedComputingDbContext dbContext,
            ISubtaskFactoryFactory subtaskFactoryFactory
        )
        {
            _dbContext = dbContext;
            _subtaskFactoryFactory = subtaskFactoryFactory;
        }

        [HttpGet]
        public IEnumerable<Subtask> Get([FromQuery] QueryArgsBase queryArgs)
        {
            return _dbContext.Subtasks
                .Paginate(queryArgs);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var foundSubtask = _dbContext.Subtasks
                .Include(subtask => subtask.DistributedTask)
                .FirstOrDefault(subtask => subtask.Id == id);

            if (foundSubtask == null) return NotFound();

            return Ok(foundSubtask);
        }

        [HttpPost]
        [ValidateModel]
        public IActionResult Create([FromBody] CreateSubtaskDTO body)
        {
            // FIXME: handle errors

            var distributedTask = _dbContext.DistributedTasks
                .FirstOrDefault(task => task.Id == body.DistributedTaskId);

            if (distributedTask == null)
            {
                ModelState.TryAddModelError(
                    nameof(body.DistributedTaskId),
                    $"A distributed task with id{body.DistributedTaskId} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            var subtaskFactory = _subtaskFactoryFactory.CreateSubtaskFactory(distributedTask.Id);

            try
            {
                subtaskFactory.CreateNewSubtask(body.InputData);
            }
            catch
            {
                // TODO: handle errors resulting from defining tasks
            }

            var createdSubtask = _dbContext.Subtasks
                .Where(subtask => subtask.DistributedTaskId == body.DistributedTaskId &&
                                  subtask.SequenceNumber == body.SequenceNumber)
                .OrderByDescending(subtask => subtask.Id).First();

            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = createdSubtask.Id }, createdSubtask);
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public IActionResult Put(int id)
        {
            // 1. Validate input data

            var restartedSubtask = _dbContext.Subtasks.FirstOrDefault(subtask => subtask.Id == id);

            if (restartedSubtask == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A subtask with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            restartedSubtask.Status = SubtaskStatus.WaitingForExecution;
            restartedSubtask.Result = "";
            restartedSubtask.Token = Guid.NewGuid().ToString();

            _dbContext.SaveChanges();

            return Ok(restartedSubtask);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deletedSubtask = _dbContext.Subtasks.FirstOrDefault(subtask => subtask.Id == id);

            if (deletedSubtask == null)
            {
                ModelState.TryAddModelError(
                    nameof(id),
                    $"A subtask with id {id} does not exist."
                );

                return new ValidationFailedResult(ModelState);
            }

            _dbContext.Subtasks.Remove(deletedSubtask);
            _dbContext.SaveChanges();

            return Ok();
        }
    }
}
