namespace issue_tracker_server.Dtos;

public class BugResponse
{
    public required int BugId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string AffectedBuild { get; set; }
    public string? FixedBuild { get; set; }
    public string? ExpectedBehavior { get; set; }
    public string? Remarks { get; set; }
    public required string Variant { get; set; }
    public required string Impact { get; set; }
    public required string Status { get; set; }
    public required string Reporter { get; set; }
    public required string Responsible { get; set; }
}
