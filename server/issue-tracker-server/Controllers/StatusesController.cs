using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;
using issue_tracker_server.Models;

namespace issue_tracker_server.Controllers;

[ApiController]
[Route("api/statuses")]
[Authorize]
public class StatusesController : ControllerBase
{
    private readonly AppDbContext _db;

    public StatusesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<LookupItemResponse>>> GetAll()
    {
        var statuses = await _db.Statuses
            .Select(s => new LookupItemResponse { Id = s.Id, Name = s.Name })
            .ToListAsync();

        return Ok(statuses);
    }

    [HttpPost]
    [Authorize(Policy = "Administration")]
    public async Task<ActionResult<LookupItemResponse>> Create(LookupItemRequest request)
    {
        var status = new Status { Name = request.Name };
        _db.Statuses.Add(status);
        await _db.SaveChangesAsync();

        var response = new LookupItemResponse { Id = status.Id, Name = status.Name };
        return CreatedAtAction(nameof(GetAll), null, response);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "Administration")]
    public async Task<ActionResult<LookupItemResponse>> Update(int id, LookupItemRequest request)
    {
        var status = await _db.Statuses.FindAsync(id);
        if (status == null)
        {
            return NotFound("Status not found.");
        }

        status.Name = request.Name;
        await _db.SaveChangesAsync();

        return Ok(new LookupItemResponse { Id = status.Id, Name = status.Name });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Administration")]
    public async Task<IActionResult> Delete(int id)
    {
        var status = await _db.Statuses.FindAsync(id);
        if (status == null)
        {
            return NotFound("Status not found.");
        }

        _db.Statuses.Remove(status);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("This status is used by one or more bugs and cannot be deleted.");
        }

        return NoContent();
    }
}
