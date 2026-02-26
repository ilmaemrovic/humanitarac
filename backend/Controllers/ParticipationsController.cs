using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using HumanitaracApi.Data;
using HumanitaracApi.Models;

namespace HumanitaracApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class ParticipationsController : ControllerBase
    {
        private readonly HumanitaracDbContext _context;

        public ParticipationsController(HumanitaracDbContext context)
        {
            _context = context;
        }

        [HttpPost("activities/{id}/join")]
        [Authorize]
        public IActionResult JoinActivity(string id, [FromBody] JoinActivityDto dto)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var activity = _context.Activities.FirstOrDefault(a => a.Id == id);
            if (activity == null) return NotFound(new { message = "Activity not found" });

            var participation = new Participation
            {
                Id = "p_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                ActivityId = id,
                UserId = userId,
                UserName = userName,
                Note = dto.Note ?? "",
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Participations.Add(participation);
            _context.SaveChanges();
            return Created($"/api/participations/{participation.Id}", new { ok = true, id = participation.Id });
        }

        [HttpGet("participations")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetParticipations()
        {
            var participations = _context.Participations.ToList();
            return Ok(participations);
        }

        [HttpPatch("participations/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateParticipation(string id, [FromBody] UpdateParticipationDto dto)
        {
            var participation = _context.Participations.FirstOrDefault(p => p.Id == id);
            if (participation == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Status)) participation.Status = dto.Status;
            if (!string.IsNullOrEmpty(dto.Note)) participation.Note = dto.Note;

            _context.SaveChanges();
            return Ok(participation);
        }
    }

    public class JoinActivityDto
    {
        public string Note { get; set; }
    }

    public class UpdateParticipationDto
    {
        public string Status { get; set; }
        public string Note { get; set; }
    }
}
