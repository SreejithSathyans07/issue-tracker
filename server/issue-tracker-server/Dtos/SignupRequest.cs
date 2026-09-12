namespace issue_tracker_server.Dtos;

public class SignupRequest
{
    public required string Name { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
}
