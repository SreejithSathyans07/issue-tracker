namespace issue_tracker_server.Dtos;

public class BugFilterRequest
{
    public List<int>? VariantIds { get; set; }
    public List<int>? ImpactIds { get; set; }
    public List<int>? StatusIds { get; set; }
    public List<int>? ReporterIds { get; set; }
    public List<int>? ResponsibleIds { get; set; }
    public List<int>? AffectedBuildIds { get; set; }
    public string? Search { get; set; }
}
