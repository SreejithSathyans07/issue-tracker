namespace issue_tracker_server.Dtos;

public class LoginRequest
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}
