namespace issue_tracker_server.Dtos;

public class UpdateBugRequest
{
    public required int StatusId { get; set; }
    public string? FixedBuild { get; set; }
    public string? Remarks { get; set; }
    public required int ResponsibleId { get; set; }
}
