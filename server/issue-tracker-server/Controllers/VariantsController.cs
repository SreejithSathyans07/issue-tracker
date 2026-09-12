using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using issue_tracker_server.Data;
using issue_tracker_server.Dtos;
using issue_tracker_server.Models;

namespace issue_tracker_server.Controllers;

[ApiController]
[Route("api/variants")]
[Authorize]
public class VariantsController : ControllerBase
{
    private readonly AppDbContext _db;

    public VariantsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<LookupItemResponse>>> GetAll()
    {
        var variants = await _db.Variants
            .Select(v => new LookupItemResponse { Id = v.Id, Name = v.Name })
            .ToListAsync();

        return Ok(variants);
    }

    [HttpPost]
    [Authorize(Policy = "Administration")]
    public async Task<ActionResult<LookupItemResponse>> Create(LookupItemRequest request)
    {
        var variant = new Variant { Name = request.Name };
        _db.Variants.Add(variant);
        await _db.SaveChangesAsync();

        var response = new LookupItemResponse { Id = variant.Id, Name = variant.Name };
        return CreatedAtAction(nameof(GetAll), null, response);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "Administration")]
    public async Task<ActionResult<LookupItemResponse>> Update(int id, LookupItemRequest request)
    {
        var variant = await _db.Variants.FindAsync(id);
        if (variant == null)
        {
            return NotFound("Variant not found.");
        }

        variant.Name = request.Name;
        await _db.SaveChangesAsync();

        return Ok(new LookupItemResponse { Id = variant.Id, Name = variant.Name });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "Administration")]
    public async Task<IActionResult> Delete(int id)
    {
        var variant = await _db.Variants.FindAsync(id);
        if (variant == null)
        {
            return NotFound("Variant not found.");
        }

        _db.Variants.Remove(variant);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("This variant is used by one or more bugs and cannot be deleted.");
        }

        return NoContent();
    }
}
