using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;
using issue_tracker_server.Models;

namespace issue_tracker_server.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<bool> IsUsernameAvailableAsync(string username)
    {
        var exists = await _db.Users
            .AnyAsync(u => u.Username.ToLower() == username.ToLower());

        return !exists;
    }

    public async Task<(UserResponse? User, string? Error)> SignupAsync(SignupRequest request)
    {
        var usernameTaken = !await IsUsernameAvailableAsync(request.Username);

        if (usernameTaken)
        {
            return (null, "Username is already taken.");
        }

        var user = new User
        {
            Name = request.Name,
            Username = request.Username,
            PasswordHash = string.Empty
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var response = new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Username = user.Username
        };

        return (response, null);
    }
}
