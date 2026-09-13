using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;
using issue_tracker_server.Models;

namespace issue_tracker_server.Services;

public class BugService : IBugService
{
    private readonly AppDbContext _db;

    public BugService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<(BugResponse? Bug, string? Error)> CreateBugAsync(CreateBugRequest request, int reporterId)
    {
        var variant = await _db.Variants.FindAsync(request.VariantId);
        if (variant == null)
        {
            return (null, "Invalid VariantId.");
        }

        var impact = await _db.Impacts.FindAsync(request.ImpactId);
        if (impact == null)
        {
            return (null, "Invalid ImpactId.");
        }

        var responsible = await _db.Users.FindAsync(request.ResponsibleId);
        if (responsible == null)
        {
            return (null, "Invalid ResponsibleId.");
        }

        var openStatus = await _db.Statuses.FirstOrDefaultAsync(s => s.Name == "Open");
        if (openStatus == null)
        {
            return (null, "Default 'Open' status is not configured.");
        }

        var reporter = await _db.Users.FindAsync(reporterId);
        if (reporter == null)
        {
            return (null, "Reporter not found.");
        }

        var bug = new Bug
        {
            Title = request.Title,
            Description = request.Description,
            AffectedBuild = request.AffectedBuild,
            ExpectedBehavior = request.ExpectedBehavior,
            Remarks = request.Remarks,
            Variant = variant,
            Impact = impact,
            Status = openStatus,
            Reporter = reporter,
            Responsible = responsible
        };

        _db.Bugs.Add(bug);
        await _db.SaveChangesAsync();

        return (ToResponse(bug), null);
    }

    public async Task<List<BugResponse>> GetAllBugsAsync()
    {
        var bugs = await _db.Bugs
            .Include(b => b.Variant)
            .Include(b => b.Impact)
            .Include(b => b.Status)
            .Include(b => b.Reporter)
            .Include(b => b.Responsible)
            .ToListAsync();

        return bugs.Select(ToResponse).ToList();
    }

    public async Task<(BugResponse? Bug, string? Error)> UpdateBugAsync(int bugId, UpdateBugRequest request)
    {
        var bug = await _db.Bugs
            .Include(b => b.Variant)
            .Include(b => b.Impact)
            .Include(b => b.Status)
            .Include(b => b.Reporter)
            .Include(b => b.Responsible)
            .FirstOrDefaultAsync(b => b.BugId == bugId);

        if (bug == null)
        {
            return (null, "Bug not found.");
        }

        var variant = await _db.Variants.FindAsync(request.VariantId);
        if (variant == null)
        {
            return (null, "Invalid VariantId.");
        }

        var impact = await _db.Impacts.FindAsync(request.ImpactId);
        if (impact == null)
        {
            return (null, "Invalid ImpactId.");
        }

        var status = await _db.Statuses.FindAsync(request.StatusId);
        if (status == null)
        {
            return (null, "Invalid StatusId.");
        }

        var responsible = await _db.Users.FindAsync(request.ResponsibleId);
        if (responsible == null)
        {
            return (null, "Invalid ResponsibleId.");
        }

        bug.Title = request.Title;
        bug.Description = request.Description;
        bug.AffectedBuild = request.AffectedBuild;
        bug.ExpectedBehavior = request.ExpectedBehavior;
        bug.Variant = variant;
        bug.Impact = impact;
        bug.Status = status;
        bug.Responsible = responsible;
        bug.FixedBuild = request.FixedBuild;
        bug.Remarks = request.Remarks;

        await _db.SaveChangesAsync();

        return (ToResponse(bug), null);
    }

    private static BugResponse ToResponse(Bug bug) => new()
    {
        BugId = bug.BugId,
        Title = bug.Title,
        Description = bug.Description,
        AffectedBuild = bug.AffectedBuild,
        FixedBuild = bug.FixedBuild,
        ExpectedBehavior = bug.ExpectedBehavior,
        Remarks = bug.Remarks,
        Variant = bug.Variant.Name,
        Impact = bug.Impact.Name,
        Status = bug.Status.Name,
        Reporter = bug.Reporter.Name,
        Responsible = bug.Responsible.Name
    };
}
