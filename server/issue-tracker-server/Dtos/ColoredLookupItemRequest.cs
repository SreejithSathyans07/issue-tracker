namespace issue_tracker_server.Dtos;

public class ColoredLookupItemRequest
{
    public required string Name { get; set; }
    public required string Color { get; set; }
    public required string Icon { get; set; }
}
