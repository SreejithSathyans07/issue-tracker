using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace issue_tracker_server.Migrations
{
    /// <inheritdoc />
    public partial class AddBuildLookupTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AffectedBuild",
                table: "Bugs");

            migrationBuilder.DropColumn(
                name: "FixedBuild",
                table: "Bugs");

            migrationBuilder.AddColumn<int>(
                name: "AffectedBuildId",
                table: "Bugs",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "FixedBuildId",
                table: "Bugs",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Builds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Builds", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Builds",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "2.3.0" },
                    { 2, "2.3.2" },
                    { 3, "2.3.4" },
                    { 4, "2.3.5" },
                    { 5, "2.3.6" },
                    { 6, "2.3.7" },
                    { 7, "2.3.8" },
                    { 8, "2.3.9" },
                    { 9, "2.4.0" },
                    { 10, "2.4.1" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bugs_AffectedBuildId",
                table: "Bugs",
                column: "AffectedBuildId");

            migrationBuilder.CreateIndex(
                name: "IX_Bugs_FixedBuildId",
                table: "Bugs",
                column: "FixedBuildId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Builds_AffectedBuildId",
                table: "Bugs",
                column: "AffectedBuildId",
                principalTable: "Builds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Builds_FixedBuildId",
                table: "Bugs",
                column: "FixedBuildId",
                principalTable: "Builds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Builds_AffectedBuildId",
                table: "Bugs");

            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Builds_FixedBuildId",
                table: "Bugs");

            migrationBuilder.DropTable(
                name: "Builds");

            migrationBuilder.DropIndex(
                name: "IX_Bugs_AffectedBuildId",
                table: "Bugs");

            migrationBuilder.DropIndex(
                name: "IX_Bugs_FixedBuildId",
                table: "Bugs");

            migrationBuilder.DropColumn(
                name: "AffectedBuildId",
                table: "Bugs");

            migrationBuilder.DropColumn(
                name: "FixedBuildId",
                table: "Bugs");

            migrationBuilder.AddColumn<string>(
                name: "AffectedBuild",
                table: "Bugs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FixedBuild",
                table: "Bugs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
