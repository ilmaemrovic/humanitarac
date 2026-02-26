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
                CreatedAt = DateTime.UtcNow
            };

            _context.Volunteers.Add(volunteer);
            _context.SaveChanges();
            return Created($"/api/volunteers/{volunteer.Id}", new { ok = true, id = volunteer.Id });
        }
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
