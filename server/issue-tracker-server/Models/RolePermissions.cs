namespace issue_tracker_server.Models;

public static class RolePermissions
{
    private static readonly Dictionary<Role, Permission[]> Map = new()
    {
        [Role.User] = [Permission.Reader, Permission.Writer],
        [Role.Admin] = [Permission.Reader, Permission.Writer, Permission.Administration]
    };

    public static Permission[] For(Role role) => Map[role];
}
