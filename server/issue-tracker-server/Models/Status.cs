namespace issue_tracker_server.Models;

public class Status
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Color { get; set; }
    public required string Icon { get; set; }
}
