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
    }
}
