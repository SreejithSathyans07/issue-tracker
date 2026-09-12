using issue_tracker_server.Dtos;

namespace issue_tracker_server.Services;

public interface IAuthService
{
    Task<bool> IsUsernameAvailableAsync(string username);
    Task<(UserResponse? User, string? Error)> SignupAsync(SignupRequest request);
    Task<(LoginResponse? Result, string? Error)> LoginAsync(LoginRequest request);
}
