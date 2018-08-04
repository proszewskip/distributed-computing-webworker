using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Pagination;
using Server.Validation;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubtaskController : Controller
    {
        private readonly DistributedComputingDbContext _dbContext;


        public SubtaskController(
            DistributedComputingDbContext dbContext
        )
        {
            _dbContext = dbContext;
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

        [HttpPost("{id}/restart")]
        [ValidateModel]
        public IActionResult Restart(int id)
        {
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
            restartedSubtask.Result = null;
            restartedSubtask.Token = Guid.NewGuid().ToString();

            _dbContext.SaveChanges();

            return Ok(restartedSubtask);
        }
    }
}
