using System;

namespace HumanitaracApi.Models
{
    public class TaskItem
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        
        // Status: "todo", "in-progress", "done"
        public string Status { get; set; } = "todo";
        
        // Priority: "low", "medium", "high"
        public string Priority { get; set; } = "medium";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
        
        // Foreign key to User
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
