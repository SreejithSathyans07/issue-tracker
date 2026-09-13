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
    public DbSet<Build> Builds { get; set; }
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
            .HasOne(b => b.AffectedBuild)
            .WithMany()
            .HasForeignKey(b => b.AffectedBuildId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bug>()
            .HasOne(b => b.FixedBuild)
            .WithMany()
            .HasForeignKey(b => b.FixedBuildId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bug>()
            .HasOne(b => b.Variant)
            .WithMany()
            .HasForeignKey(b => b.VariantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bug>()
            .HasOne(b => b.Impact)
            .WithMany()
            .HasForeignKey(b => b.ImpactId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bug>()
            .HasOne(b => b.Status)
            .WithMany()
            .HasForeignKey(b => b.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

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
            new Impact { Id = 1, Name = "Cosmetic", Color = "#9CA3AF", Icon = "eye" },
            new Impact { Id = 2, Name = "Minor", Color = "#3B82F6", Icon = "alert-circle" },
            new Impact { Id = 3, Name = "Major", Color = "#F59E0B", Icon = "alert-triangle" },
            new Impact { Id = 4, Name = "Critical", Color = "#EF4444", Icon = "zap" },
            new Impact { Id = 5, Name = "Blocker", Color = "#7F1D1D", Icon = "alert-octagon" }
        );

        modelBuilder.Entity<Variant>().HasData(
            new Variant { Id = 1, Name = "DE" },
            new Variant { Id = 2, Name = "DELF7" },
            new Variant { Id = 3, Name = "AT" },
            new Variant { Id = 4, Name = "FR" },
            new Variant { Id = 5, Name = "UK" }
        );

        modelBuilder.Entity<Status>().HasData(
            new Status { Id = 1, Name = "Open", Color = "#2563EB", Icon = "circle" },
            new Status { Id = 2, Name = "Closed", Color = "#6B7280", Icon = "x-circle" },
            new Status { Id = 3, Name = "Resolved", Color = "#059669", Icon = "check-circle" },
            new Status { Id = 4, Name = "In Test", Color = "#7C3AED", Icon = "activity" },
            new Status { Id = 5, Name = "In Progress", Color = "#D97706", Icon = "refresh-cw" },
            new Status { Id = 6, Name = "On Hold", Color = "#B45309", Icon = "pause-circle" },
            new Status { Id = 7, Name = "Needs Support", Color = "#DC2626", Icon = "life-buoy" },
            new Status { Id = 8, Name = "Not an issue", Color = "#9CA3AF", Icon = "slash" },
            new Status { Id = 9, Name = "Change Request", Color = "#0891B2", Icon = "clipboard" }
        );

        modelBuilder.Entity<Build>().HasData(
            new Build { Id = 1, Name = "2.3.0" },
            new Build { Id = 2, Name = "2.3.2" },
            new Build { Id = 3, Name = "2.3.4" },
            new Build { Id = 4, Name = "2.3.5" },
            new Build { Id = 5, Name = "2.3.6" },
            new Build { Id = 6, Name = "2.3.7" },
            new Build { Id = 7, Name = "2.3.8" },
            new Build { Id = 8, Name = "2.3.9" },
            new Build { Id = 9, Name = "2.4.0" },
            new Build { Id = 10, Name = "2.4.1" }
        );
    }
}
