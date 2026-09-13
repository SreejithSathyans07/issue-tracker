namespace issue_tracker_server.Dtos;

public class ColoredLookupItemResponse
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required string Color { get; set; }
    public required string Icon { get; set; }
}
