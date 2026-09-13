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
            .Select(u => new UserResponse { Id = u.Id, Name = u.Name, Username = u.Username })
            .ToListAsync();

        return Ok(users);
    }
}
