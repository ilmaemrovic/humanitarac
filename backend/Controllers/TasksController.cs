using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitaracApi.Data;
using HumanitaracApi.Models;

namespace HumanitaracApi.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private static readonly HashSet<string> ValidStatuses = new HashSet<string> { "todo", "in-progress", "done" };
        private static readonly HashSet<string> ValidPriorities = new HashSet<string> { "low", "medium", "high" };

        private readonly HumanitaracDbContext _context;

        public TasksController(HumanitaracDbContext context)
        {
            _context = context;
        }

        private string GetUserId()
        {
            return User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        /// GET /api/tasks — get all tasks for the logged-in user
        [HttpGet]
        public IActionResult GetMyTasks()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Korisnik nije autentificiran" });

            var tasks = _context.TaskItems
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Status,
                    t.Priority,
                    t.CreatedAt,
                    t.DueDate
                })
                .ToList();

            return Ok(new { ok = true, tasks });
        }

        /// GET /api/tasks/{id}
        [HttpGet("{id}")]
        public IActionResult GetTask(string id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Korisnik nije autentificiran" });

            var task = _context.TaskItems.FirstOrDefault(t => t.Id == id && t.UserId == userId);
            if (task == null) return NotFound(new { message = "Task nije pronađen" });

            return Ok(new
            {
                ok = true,
                task = new
                {
                    task.Id,
                    task.Title,
                    task.Description,
                    task.Status,
                    task.Priority,
                    task.CreatedAt,
                    task.DueDate
                }
            });
        }

        /// POST /api/tasks — create a new task
        [HttpPost]
        public IActionResult CreateTask([FromBody] CreateTaskDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Korisnik nije autentificiran" });

            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Naslov je obavezan" });
            if (dto.Status != null && !ValidStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Nevažeći status" });
            if (dto.Priority != null && !ValidPriorities.Contains(dto.Priority))
                return BadRequest(new { message = "Nevažeći prioritet" });

            var task = new TaskItem
            {
                Id = "task_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Title = dto.Title.Trim(),
                Description = dto.Description ?? "",
                Status = dto.Status ?? "todo",
                Priority = dto.Priority ?? "medium",
                DueDate = dto.DueDate,
                UserId = userId
            };

            _context.TaskItems.Add(task);
            _context.SaveChanges();

            return Created($"/api/tasks/{task.Id}", new
            {
                ok = true,
                task = new
                {
                    task.Id,
                    task.Title,
                    task.Description,
                    task.Status,
                    task.Priority,
                    task.CreatedAt,
                    task.DueDate
                }
            });
        }

        /// PUT /api/tasks/{id} — update a task
        [HttpPut("{id}")]
        public IActionResult UpdateTask(string id, [FromBody] UpdateTaskDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Korisnik nije autentificiran" });

            var task = _context.TaskItems.FirstOrDefault(t => t.Id == id && t.UserId == userId);
            if (task == null) return NotFound(new { message = "Task nije pronađen" });

            if (!string.IsNullOrWhiteSpace(dto.Status) && !ValidStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Nevažeći status" });
            if (!string.IsNullOrWhiteSpace(dto.Priority) && !ValidPriorities.Contains(dto.Priority))
                return BadRequest(new { message = "Nevažeći prioritet" });

            if (!string.IsNullOrWhiteSpace(dto.Title)) task.Title = dto.Title.Trim();
            if (dto.Description != null) task.Description = dto.Description;
            if (!string.IsNullOrWhiteSpace(dto.Status)) task.Status = dto.Status;
            if (!string.IsNullOrWhiteSpace(dto.Priority)) task.Priority = dto.Priority;
            if (dto.DueDate.HasValue || dto.ClearDueDate) task.DueDate = dto.DueDate;

            _context.SaveChanges();

            return Ok(new
            {
                ok = true,
                task = new
                {
                    task.Id,
                    task.Title,
                    task.Description,
                    task.Status,
                    task.Priority,
                    task.CreatedAt,
                    task.DueDate
                }
            });
        }

        /// DELETE /api/tasks/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(string id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized(new { message = "Korisnik nije autentificiran" });

            var task = _context.TaskItems.FirstOrDefault(t => t.Id == id && t.UserId == userId);
            if (task == null) return NotFound(new { message = "Task nije pronađen" });

            _context.TaskItems.Remove(task);
            _context.SaveChanges();

            return Ok(new { ok = true, message = "Task uspješno obrisan" });
        }
    }

    public class CreateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime? DueDate { get; set; }
    }

    public class UpdateTaskDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public DateTime? DueDate { get; set; }
        // DueDate null means "unchanged" unless this is set
        public bool ClearDueDate { get; set; }
    }
}
