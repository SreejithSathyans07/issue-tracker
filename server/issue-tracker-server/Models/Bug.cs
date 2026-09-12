namespace issue_tracker_server.Models;

public class Bug
{
    public int BugId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string AffectedBuild { get; set; }
    public string FixedBuild { get; set; }

    public int VariantId { get; set; }
    public Variant Variant { get; set; }

    public int ImpactId { get; set; }
    public Impact Impact { get; set; }

    public int StatusId { get; set; }
    public Status Status { get; set; }

    public int ReporterId { get; set; }
    public User Reporter { get; set; }

    public int ResponsibleId { get; set; }
    public User Responsible { get; set; }
}
