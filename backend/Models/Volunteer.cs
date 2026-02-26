using System;

namespace HumanitaracApi.Models
{
    public class Volunteer
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Interests { get; set; } // comma-separated
        public string Availability { get; set; } // weekdays, weekends, flexible
        public string Status { get; set; } = "pending"; // pending, accepted, rejected
        public string? UserId { get; set; } // optional if registered user
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
