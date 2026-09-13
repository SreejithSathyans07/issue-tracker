namespace issue_tracker_server.Models;

public class Bug
{
    public int BugId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public string? ExpectedBehavior { get; set; }
    public string? Remarks { get; set; }

    public int AffectedBuildId { get; set; }
    public required Build AffectedBuild { get; set; }

    public int? FixedBuildId { get; set; }
    public Build? FixedBuild { get; set; }

    public int VariantId { get; set; }
    public required Variant Variant { get; set; }

    public int ImpactId { get; set; }
    public required Impact Impact { get; set; }

    public int StatusId { get; set; }
    public required Status Status { get; set; }

    public int ReporterId { get; set; }
    public required User Reporter { get; set; }

    public int ResponsibleId { get; set; }
    public required User Responsible { get; set; }
}
