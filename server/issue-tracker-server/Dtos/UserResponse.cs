namespace issue_tracker_server.Dtos;

public class UserResponse
{
    public required int Id { get; set; }
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string Role { get; set; }
}
