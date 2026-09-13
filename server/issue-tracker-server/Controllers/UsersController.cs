using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;

namespace issue_tracker_server.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetAll()
    {
        var users = await _db.Users
            .Select(u => new UserResponse { Id = u.Id, Name = u.Name, Username = u.Username, Role = u.Role.ToString() })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPut("{id}/role")]
    [Authorize(Policy = "Administration")]
    public async Task<ActionResult<UserResponse>> UpdateRole(int id, UpdateUserRoleRequest request)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        user.Role = request.Role;
        await _db.SaveChangesAsync();

        return Ok(new UserResponse { Id = user.Id, Name = user.Name, Username = user.Username, Role = user.Role.ToString() });
    }
}
