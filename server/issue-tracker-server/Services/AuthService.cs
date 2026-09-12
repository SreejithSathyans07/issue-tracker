using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;
using issue_tracker_server.Models;

namespace issue_tracker_server.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
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

    public async Task<(LoginResponse? Result, string? Error)> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower());

        if (user == null)
        {
            return (null, "Invalid username or password.");
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return (null, "Invalid username or password.");
        }

        var token = GenerateJwtToken(user);

        var result = new LoginResponse
        {
            Token = token,
            User = new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username
            }
        };

        return (result, null);
    }

    private string GenerateJwtToken(User user)
    {
        var signingKey = _config["Jwt:SigningKey"]
            ?? throw new InvalidOperationException("Jwt:SigningKey is not configured.");

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("role", user.Role.ToString())
        };

        claims.AddRange(RolePermissions.For(user.Role)
            .Select(permission => new Claim("permission", permission.ToString())));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryDays = _config.GetValue<int>("Jwt:ExpiryDays", 7);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiryDays),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
