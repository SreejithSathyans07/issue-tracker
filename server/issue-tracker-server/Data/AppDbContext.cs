using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Models;

namespace issue_tracker_server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Variant> Variants { get; set; }
    public DbSet<Impact> Impacts { get; set; }
    public DbSet<Status> Statuses { get; set; }
    public DbSet<Bug> Bugs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        modelBuilder.Entity<Bug>()
            .HasOne(b => b.Reporter)
            .WithMany()
            .HasForeignKey(b => b.ReporterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bug>()
            .HasOne(b => b.Responsible)
            .WithMany()
            .HasForeignKey(b => b.ResponsibleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Impact>().HasData(
            new Impact { Id = 1, Name = "Cosmetic" },
            new Impact { Id = 2, Name = "Minor" },
            new Impact { Id = 3, Name = "Major" },
            new Impact { Id = 4, Name = "Critical" },
            new Impact { Id = 5, Name = "Blocker" }
        );

        modelBuilder.Entity<Variant>().HasData(
            new Variant { Id = 1, Name = "DE" },
            new Variant { Id = 2, Name = "DELF7" },
            new Variant { Id = 3, Name = "AT" },
            new Variant { Id = 4, Name = "FR" },
            new Variant { Id = 5, Name = "UK" }
        );

        modelBuilder.Entity<Status>().HasData(
            new Status { Id = 1, Name = "Open" },
            new Status { Id = 2, Name = "Closed" },
            new Status { Id = 3, Name = "Resolved" },
            new Status { Id = 4, Name = "In Test" },
            new Status { Id = 5, Name = "In Progress" },
            new Status { Id = 6, Name = "On Hold" },
            new Status { Id = 7, Name = "Needs Support" },
            new Status { Id = 8, Name = "Not an issue" },
            new Status { Id = 9, Name = "Change Request" }
        );
    }
}
