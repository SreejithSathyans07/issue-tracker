namespace issue_tracker_server.Dtos;

public class CreateBugRequest
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required int AffectedBuildId { get; set; }
    public string? ExpectedBehavior { get; set; }
    public string? Remarks { get; set; }
    public required int VariantId { get; set; }
    public required int ImpactId { get; set; }
    public required int ResponsibleId { get; set; }
}
