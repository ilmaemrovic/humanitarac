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
    public class DonationsController : ControllerBase
    {
        private readonly HumanitaracDbContext _context;

        public DonationsController(HumanitaracDbContext context)
        {
            _context = context;
        }

        [HttpPost("donations")]
        [Authorize]
        public IActionResult CreateDonation([FromBody] CreateDonationDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "Neispravan token" });

            var donation = new Donation
            {
                Id = "d_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                UserId = userId,
                Name = dto.Name,
                Email = dto.Email,
                Amount = dto.Amount,
                Method = dto.Method,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.Donations.Add(donation);
            _context.SaveChanges();
            return Created($"/api/donations/{donation.Id}", new { ok = true, id = donation.Id });
        }
    }

    public class CreateDonationDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; }
        public string Message { get; set; }
    }
}
