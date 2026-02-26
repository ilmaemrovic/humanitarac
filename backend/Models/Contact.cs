using System;

namespace HumanitaracApi.Models
{
    public class Contact
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
        public string Status { get; set; } = "new"; // new, reviewed, resolved
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
