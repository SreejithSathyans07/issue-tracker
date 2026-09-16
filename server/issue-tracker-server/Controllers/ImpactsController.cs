using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;
using issue_tracker_server.Models;

namespace issue_tracker_server.Controllers;

[ApiController]
[Route("api/impacts")]
[Authorize]
public class ImpactsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ImpactsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<ColoredLookupItemResponse>>> GetAll()
    {
        var impacts = await _db.Impacts
            .Select(i => new ColoredLookupItemResponse { Id = i.Id, Name = i.Name, Color = i.Color, Icon = i.Icon })
            .ToListAsync();

        return Ok(impacts);
    }

    [HttpPost]
    [Authorize(Policy = "Writer")]
    public async Task<ActionResult<ColoredLookupItemResponse>> Create(ColoredLookupItemRequest request)
    {
        var impact = new Impact { Name = request.Name, Color = request.Color, Icon = request.Icon };
        _db.Impacts.Add(impact);
        await _db.SaveChangesAsync();

        var response = new ColoredLookupItemResponse { Id = impact.Id, Name = impact.Name, Color = impact.Color, Icon = impact.Icon };
        return CreatedAtAction(nameof(GetAll), null, response);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "Writer")]
    public async Task<ActionResult<ColoredLookupItemResponse>> Update(int id, ColoredLookupItemRequest request)
    {
        var impact = await _db.Impacts.FindAsync(id);
        if (impact == null)
        {
            return NotFound("Impact not found.");
        }

        impact.Name = request.Name;
        impact.Color = request.Color;
        impact.Icon = request.Icon;
        await _db.SaveChangesAsync();

        return Ok(new ColoredLookupItemResponse { Id = impact.Id, Name = impact.Name, Color = impact.Color, Icon = impact.Icon });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Writer")]
    public async Task<IActionResult> Delete(int id)
    {
        var impact = await _db.Impacts.FindAsync(id);
        if (impact == null)
        {
            return NotFound("Impact not found.");
        }

        _db.Impacts.Remove(impact);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("This impact is used by one or more bugs and cannot be deleted.");
        }

        return NoContent();
    }
}
