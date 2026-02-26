using Microsoft.EntityFrameworkCore;
using HumanitaracApi.Models;

namespace HumanitaracApi.Data
{
    public class HumanitaracDbContext : DbContext
    {
        public HumanitaracDbContext(DbContextOptions<HumanitaracDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Participation> Participations { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);
            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired();

            // Activity configuration
            modelBuilder.Entity<Activity>()
                .HasKey(a => a.Id);
            modelBuilder.Entity<Activity>()
                .HasMany(a => a.Participations)
                .WithOne(p => p.Activity)
                .HasForeignKey(p => p.ActivityId)
                .OnDelete(DeleteBehavior.Cascade);

            // Participation configuration
            modelBuilder.Entity<Participation>()
                .HasKey(p => p.Id);
            modelBuilder.Entity<Participation>()
                .HasOne(p => p.Activity)
                .WithMany(a => a.Participations)
                .HasForeignKey(p => p.ActivityId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var now = System.DateTime.UtcNow;

            modelBuilder.Entity<User>().HasData(
                new User { Id = "u_admin_1", Name = "Marko Ilic", Email = "marko.ilic@example.com", Password = "adminpass1", Role = "Admin" },
                new User { Id = "u_admin_2", Name = "Aleksandar Vukasnovic", Email = "aleksandar.v@example.com", Password = "adminpass2", Role = "Admin" },
                new User { Id = "u_user_1", Name = "Ilma Emrovic", Email = "ilma.emrovic@example.com", Password = "userpass1", Role = "User" },
                new User { Id = "u_user_2", Name = "Aldina Avdic", Email = "aldina.avdic@example.com", Password = "userpass2", Role = "User" }
            );

            modelBuilder.Entity<Activity>().HasData(
                new Activity { Id = "a1", Title = "Distribucija hrane i higijene", Date = now.AddDays(-3), City = "Novi Pazar", Category = "Pomoć", Description = "Podjela prehrambenih paketa." },
                new Activity { Id = "a2", Title = "Edukacija o sanitaciji", Date = now.AddDays(-10), City = "Sjenica", Category = "Edukacija", Description = "Radionica o higijeni." },
                new Activity { Id = "a3", Title = "Prikupljanje pomoći", Date = now.AddDays(-20), City = "Tutin", Category = "Krizna pomoć", Description = "Prikupljanje potrepština." },
                new Activity { Id = "a4", Title = "Park Čišćenje", Date = now.AddDays(-30), City = "Beograd", Category = "Volontiranje", Description = "Čišćenje parka." }
            );
        }
    }
}
