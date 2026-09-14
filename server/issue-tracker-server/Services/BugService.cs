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
        var affectedBuild = await _db.Builds.FindAsync(request.AffectedBuildId);
        if (affectedBuild == null)
        {
            return (null, "Invalid AffectedBuildId.");
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
            AffectedBuild = affectedBuild,
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

    public async Task<List<BugResponse>> GetAllBugsAsync(BugFilterRequest filter)
    {
        var query = _db.Bugs
            .Include(b => b.AffectedBuild)
            .Include(b => b.FixedBuild)
            .Include(b => b.Variant)
            .Include(b => b.Impact)
            .Include(b => b.Status)
            .Include(b => b.Reporter)
            .Include(b => b.Responsible)
            .AsQueryable();

        if (filter.VariantIds is { Count: > 0 })
        {
            query = query.Where(b => filter.VariantIds.Contains(b.VariantId));
        }

        if (filter.ImpactIds is { Count: > 0 })
        {
            query = query.Where(b => filter.ImpactIds.Contains(b.ImpactId));
        }

        if (filter.StatusIds is { Count: > 0 })
        {
            query = query.Where(b => filter.StatusIds.Contains(b.StatusId));
        }

        if (filter.ReporterIds is { Count: > 0 })
        {
            query = query.Where(b => filter.ReporterIds.Contains(b.ReporterId));
        }

        if (filter.ResponsibleIds is { Count: > 0 })
        {
            query = query.Where(b => filter.ResponsibleIds.Contains(b.ResponsibleId));
        }

        if (filter.AffectedBuildIds is { Count: > 0 })
        {
            query = query.Where(b => filter.AffectedBuildIds.Contains(b.AffectedBuildId));
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim();
            query = query.Where(b => EF.Functions.Like(b.Title, $"%{search}%") || EF.Functions.Like(b.Description, $"%{search}%"));
        }

        var bugs = await query.ToListAsync();

        return bugs.Select(ToResponse).ToList();
    }

    public async Task<(BugResponse? Bug, string? Error)> UpdateBugAsync(int bugId, UpdateBugRequest request)
    {
        var bug = await _db.Bugs
            .Include(b => b.AffectedBuild)
            .Include(b => b.FixedBuild)
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

        var affectedBuild = await _db.Builds.FindAsync(request.AffectedBuildId);
        if (affectedBuild == null)
        {
            return (null, "Invalid AffectedBuildId.");
        }

        Build? fixedBuild = null;
        if (request.FixedBuildId.HasValue)
        {
            fixedBuild = await _db.Builds.FindAsync(request.FixedBuildId.Value);
            if (fixedBuild == null)
            {
                return (null, "Invalid FixedBuildId.");
            }
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
        bug.AffectedBuild = affectedBuild;
        bug.FixedBuild = fixedBuild;
        bug.ExpectedBehavior = request.ExpectedBehavior;
        bug.Variant = variant;
        bug.Impact = impact;
        bug.Status = status;
        bug.Responsible = responsible;
        bug.Remarks = request.Remarks;

        await _db.SaveChangesAsync();

        return (ToResponse(bug), null);
    }

    private static BugResponse ToResponse(Bug bug) => new()
    {
        BugId = bug.BugId,
        Title = bug.Title,
        Description = bug.Description,
        AffectedBuild = bug.AffectedBuild.Name,
        FixedBuild = bug.FixedBuild?.Name,
        ExpectedBehavior = bug.ExpectedBehavior,
        Remarks = bug.Remarks,
        Variant = bug.Variant.Name,
        Impact = bug.Impact.Name,
        Status = bug.Status.Name,
        Reporter = bug.Reporter.Name,
        Responsible = bug.Responsible.Name
    };
}
