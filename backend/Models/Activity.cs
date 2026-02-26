using System;
using System.Collections.Generic;

namespace HumanitaracApi.Models
{
    public class Activity
    {
        public string Id { get; set; } = "a_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        public string Title { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public bool Completed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation
        public ICollection<Participation> Participations { get; set; } = new List<Participation>();
    }
}
