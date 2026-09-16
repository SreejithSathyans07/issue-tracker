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
    public async Task<ActionResult<List<ColoredLookupItemResponse>>> GetAll()
    {
        var statuses = await _db.Statuses
            .Select(s => new ColoredLookupItemResponse { Id = s.Id, Name = s.Name, Color = s.Color, Icon = s.Icon })
            .ToListAsync();

        return Ok(statuses);
    }

    [HttpPost]
    [Authorize(Policy = "Writer")]
    public async Task<ActionResult<ColoredLookupItemResponse>> Create(ColoredLookupItemRequest request)
    {
        var status = new Status { Name = request.Name, Color = request.Color, Icon = request.Icon };
        _db.Statuses.Add(status);
        await _db.SaveChangesAsync();

        var response = new ColoredLookupItemResponse { Id = status.Id, Name = status.Name, Color = status.Color, Icon = status.Icon };
        return CreatedAtAction(nameof(GetAll), null, response);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "Writer")]
    public async Task<ActionResult<ColoredLookupItemResponse>> Update(int id, ColoredLookupItemRequest request)
    {
        var status = await _db.Statuses.FindAsync(id);
        if (status == null)
        {
            return NotFound("Status not found.");
        }

        status.Name = request.Name;
        status.Color = request.Color;
        status.Icon = request.Icon;
        await _db.SaveChangesAsync();

        return Ok(new ColoredLookupItemResponse { Id = status.Id, Name = status.Name, Color = status.Color, Icon = status.Icon });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Writer")]
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
