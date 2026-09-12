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
    public async Task<ActionResult<List<LookupItemResponse>>> GetAll()
    {
        var impacts = await _db.Impacts
            .Select(i => new LookupItemResponse { Id = i.Id, Name = i.Name })
            .ToListAsync();

        return Ok(impacts);
    }

    [HttpPost]
    [Authorize(Policy = "Administration")]
    public async Task<ActionResult<LookupItemResponse>> Create(LookupItemRequest request)
    {
        var impact = new Impact { Name = request.Name };
        _db.Impacts.Add(impact);
        await _db.SaveChangesAsync();

        var response = new LookupItemResponse { Id = impact.Id, Name = impact.Name };
        return CreatedAtAction(nameof(GetAll), null, response);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "Administration")]
    public async Task<ActionResult<LookupItemResponse>> Update(int id, LookupItemRequest request)
    {
        var impact = await _db.Impacts.FindAsync(id);
        if (impact == null)
        {
            return NotFound("Impact not found.");
        }

        impact.Name = request.Name;
        await _db.SaveChangesAsync();

        return Ok(new LookupItemResponse { Id = impact.Id, Name = impact.Name });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Administration")]
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
