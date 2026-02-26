using System;

namespace HumanitaracApi.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "User"; // Admin, User, Volunteer, Donor
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
