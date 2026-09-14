using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using issue_tracker_server.Dtos;
using issue_tracker_server.Services;

namespace issue_tracker_server.Controllers;

[ApiController]
[Route("api/bugs")]
[Authorize]
public class BugsController : ControllerBase
{
    private readonly IBugService _bugService;

    public BugsController(IBugService bugService)
    {
        _bugService = bugService;
    }

    [HttpPost]
    public async Task<ActionResult<BugResponse>> CreateBug(CreateBugRequest request)
    {
        var reporterId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

        var (bug, error) = await _bugService.CreateBugAsync(request, reporterId);

        if (error != null)
        {
            return BadRequest(error);
        }

        return CreatedAtAction(nameof(GetAllBugs), null, bug);
    }

    [HttpGet]
    public async Task<ActionResult<List<BugResponse>>> GetAllBugs([FromQuery] BugFilterRequest filter)
    {
        var bugs = await _bugService.GetAllBugsAsync(filter);
        return Ok(bugs);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BugResponse>> UpdateBug(int id, UpdateBugRequest request)
    {
        var (bug, error) = await _bugService.UpdateBugAsync(id, request);

        if (error != null)
        {
            return BadRequest(error);
        }

        return Ok(bug);
    }
}
