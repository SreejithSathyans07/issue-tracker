using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace issue_tracker_server.Migrations
{
    /// <inheritdoc />
    public partial class AddExpectedBehaviorAndRemarksToBug : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExpectedBehavior",
                table: "Bugs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "Bugs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpectedBehavior",
                table: "Bugs");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "Bugs");
        }
    }
}
