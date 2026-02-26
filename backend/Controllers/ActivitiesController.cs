using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitaracApi.Data;
using HumanitaracApi.Models;

namespace HumanitaracApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class ActivitiesController : ControllerBase
    {
        private readonly HumanitaracDbContext _context;

        public ActivitiesController(HumanitaracDbContext context)
        {
            _context = context;
        }

        [HttpGet("activities")]
        public IActionResult GetActivities([FromQuery] int? limit)
        {
            var query = _context.Activities.AsQueryable();
            if (limit.HasValue && limit > 0) query = query.Take(limit.Value);
            return Ok(query.ToList());
        }

        [HttpGet("activities/{id}")]
        public IActionResult GetActivity(string id)
        {
            var activity = _context.Activities.FirstOrDefault(a => a.Id == id);
            if (activity == null) return NotFound(new { message = "Not found" });
            return Ok(activity);
        }

        [HttpPost("activities")]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateActivity([FromBody] CreateActivityDto dto)
        {
            var activity = new Activity
            {
                Id = "a_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Title = dto.Title,
                Description = dto.Description,
                City = dto.City,
                Category = dto.Category,
                Date = dto.Date,
                CreatedAt = DateTime.UtcNow
            };
            _context.Activities.Add(activity);
            _context.SaveChanges();
            return Created($"/api/activities/{activity.Id}", activity);
        }

        [HttpPut("activities/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateActivity(string id, [FromBody] UpdateActivityDto dto)
        {
            var activity = _context.Activities.FirstOrDefault(a => a.Id == id);
            if (activity == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Title)) activity.Title = dto.Title;
            if (!string.IsNullOrEmpty(dto.Description)) activity.Description = dto.Description;
            if (!string.IsNullOrEmpty(dto.City)) activity.City = dto.City;
            if (!string.IsNullOrEmpty(dto.Category)) activity.Category = dto.Category;
            if (dto.Date.HasValue) activity.Date = dto.Date.Value;
            if (dto.Completed.HasValue) activity.Completed = dto.Completed.Value;

            _context.SaveChanges();
            return Ok(activity);
        }

        [HttpDelete("activities/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteActivity(string id)
        {
            var activity = _context.Activities.FirstOrDefault(a => a.Id == id);
            if (activity == null) return NotFound();

            _context.Activities.Remove(activity);
            _context.Participations.RemoveRange(_context.Participations.Where(p => p.ActivityId == id));
            _context.SaveChanges();
            return Ok(new { ok = true });
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            return Ok(new
            {
                actions = _context.Activities.Count(),
                raised = _context.Donations.Sum(d => d.Amount),
                volunteers = _context.Volunteers.Count()
            });
        }
    }

    public class CreateActivityDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
    }

    public class UpdateActivityDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public DateTime? Date { get; set; }
        public bool? Completed { get; set; }
    }
}
