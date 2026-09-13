using issue_tracker_server.Models;

namespace issue_tracker_server.Dtos;

public class UpdateUserRoleRequest
{
    public required Role Role { get; set; }
}
