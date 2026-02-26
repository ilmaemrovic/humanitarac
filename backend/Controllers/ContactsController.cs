using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HumanitaracApi.Data;
using HumanitaracApi.Models;

namespace HumanitaracApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class ContactsController : ControllerBase
    {
        private readonly HumanitaracDbContext _context;

        public ContactsController(HumanitaracDbContext context)
        {
            _context = context;
        }

        [HttpPost("contact")]
        public IActionResult CreateContact([FromBody] CreateContactDto dto)
        {
            var contact = new Contact
            {
                Id = "c_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Name = dto.Name,
                Email = dto.Email,
                Message = dto.Message,
                Status = "new",
                CreatedAt = DateTime.UtcNow
            };

            _context.Contacts.Add(contact);
            _context.SaveChanges();
            return Created($"/api/contact/{contact.Id}", new { ok = true, id = contact.Id });
        }

        [HttpGet("contacts")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetContacts()
        {
            var contacts = _context.Contacts.ToList();
            return Ok(contacts);
        }
    }

    public class CreateContactDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}
