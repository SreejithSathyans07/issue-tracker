namespace issue_tracker_server.Models;

public class User
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string PasswordHash { get; set; }
}
