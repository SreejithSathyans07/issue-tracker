using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace issue_tracker_server.Migrations
{
    /// <inheritdoc />
    public partial class AddColorAndIconToStatusAndImpact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Statuses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Statuses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Impacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Impacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Impacts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#9CA3AF", "eye" });

            migrationBuilder.UpdateData(
                table: "Impacts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#3B82F6", "alert-circle" });

            migrationBuilder.UpdateData(
                table: "Impacts",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#F59E0B", "alert-triangle" });

            migrationBuilder.UpdateData(
                table: "Impacts",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#EF4444", "zap" });

            migrationBuilder.UpdateData(
                table: "Impacts",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#7F1D1D", "alert-octagon" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#2563EB", "circle" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#6B7280", "x-circle" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#059669", "check-circle" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#7C3AED", "activity" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#D97706", "refresh-cw" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#B45309", "pause-circle" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#DC2626", "life-buoy" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#9CA3AF", "slash" });

            migrationBuilder.UpdateData(
                table: "Statuses",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Color", "Icon" },
                values: new object[] { "#0891B2", "clipboard" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Statuses");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Statuses");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Impacts");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Impacts");
        }
    }
}
