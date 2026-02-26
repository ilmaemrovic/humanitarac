using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using HumanitaracApi.Data;
using HumanitaracApi.Models;

namespace HumanitaracApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class VolunteersController : ControllerBase
    {
        private readonly HumanitaracDbContext _context;

        public VolunteersController(HumanitaracDbContext context)
        {
            _context = context;
        }

        [HttpGet("volunteers")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public IActionResult GetVolunteers()
        {
            var volunteers = _context.Volunteers.OrderByDescending(v => v.CreatedAt).ToList();
            return Ok(volunteers);
        }

        [HttpPost("volunteers")]
        public IActionResult CreateVolunteer([FromBody] CreateVolunteerDto dto)
        {
            var volunteer = new Volunteer
            {
                Id = "v_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Interests = string.Join(",", dto.Interests ?? new string[] { }),
                Availability = dto.Availability,
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Volunteers.Add(volunteer);
            _context.SaveChanges();
            return Created($"/api/volunteers/{volunteer.Id}", new { ok = true, id = volunteer.Id });
        }

        [HttpPatch("volunteers/{id}")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public IActionResult UpdateVolunteerStatus(string id, [FromBody] UpdateVolunteerStatusDto dto)
        {
            var volunteer = _context.Volunteers.FirstOrDefault(v => v.Id == id);
            if (volunteer == null) return NotFound(new { error = "Volonter nije pronađen" });
            volunteer.Status = dto.Status;
            _context.SaveChanges();
            return Ok(new { ok = true, status = volunteer.Status });
        }
    }

    public class UpdateVolunteerStatusDto
    {
        public string Status { get; set; }
    }

    public class CreateVolunteerDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string[] Interests { get; set; }
        public string Availability { get; set; }
    }
}
