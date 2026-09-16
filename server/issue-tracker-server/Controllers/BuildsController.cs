using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;
using issue_tracker_server.Models;

namespace issue_tracker_server.Controllers;

[ApiController]
[Route("api/builds")]
[Authorize]
public class BuildsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BuildsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<LookupItemResponse>>> GetAll()
    {
        var builds = await _db.Builds
            .Select(b => new LookupItemResponse { Id = b.Id, Name = b.Name })
            .ToListAsync();

        return Ok(builds);
    }

    [HttpPost]
    [Authorize(Policy = "Writer")]
    public async Task<ActionResult<LookupItemResponse>> Create(LookupItemRequest request)
    {
        var build = new Build { Name = request.Name };
        _db.Builds.Add(build);
        await _db.SaveChangesAsync();

        var response = new LookupItemResponse { Id = build.Id, Name = build.Name };
        return CreatedAtAction(nameof(GetAll), null, response);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "Writer")]
    public async Task<ActionResult<LookupItemResponse>> Update(int id, LookupItemRequest request)
    {
        var build = await _db.Builds.FindAsync(id);
        if (build == null)
        {
            return NotFound("Build not found.");
        }

        build.Name = request.Name;
        await _db.SaveChangesAsync();

        return Ok(new LookupItemResponse { Id = build.Id, Name = build.Name });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Writer")]
    public async Task<IActionResult> Delete(int id)
    {
        var build = await _db.Builds.FindAsync(id);
        if (build == null)
        {
            return NotFound("Build not found.");
        }

        _db.Builds.Remove(build);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("This build is used by one or more bugs and cannot be deleted.");
        }

        return NoContent();
    }
}
