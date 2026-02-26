using System;

namespace HumanitaracApi.Models
{
    public class Participation
    {
        public string Id { get; set; }
        public string ActivityId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Note { get; set; }
        public string Status { get; set; } = "pending"; // pending, accepted, rejected
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation
        public Activity Activity { get; set; }
    }
}
