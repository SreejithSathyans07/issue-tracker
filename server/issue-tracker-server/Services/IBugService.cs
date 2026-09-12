using issue_tracker_server.Dtos;

namespace issue_tracker_server.Services;

public interface IBugService
{
    Task<(BugResponse? Bug, string? Error)> CreateBugAsync(CreateBugRequest request, int reporterId);
    Task<List<BugResponse>> GetAllBugsAsync();
    Task<(BugResponse? Bug, string? Error)> UpdateBugAsync(int bugId, UpdateBugRequest request);
}
