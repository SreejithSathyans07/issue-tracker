using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace issue_tracker_server.Migrations
{
    /// <inheritdoc />
    public partial class RestrictDeleteOnBugLookupFks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Impacts_ImpactId",
                table: "Bugs");

            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Statuses_StatusId",
                table: "Bugs");

            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Variants_VariantId",
                table: "Bugs");

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Impacts_ImpactId",
                table: "Bugs",
                column: "ImpactId",
                principalTable: "Impacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Statuses_StatusId",
                table: "Bugs",
                column: "StatusId",
                principalTable: "Statuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Variants_VariantId",
                table: "Bugs",
                column: "VariantId",
                principalTable: "Variants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Impacts_ImpactId",
                table: "Bugs");

            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Statuses_StatusId",
                table: "Bugs");

            migrationBuilder.DropForeignKey(
                name: "FK_Bugs_Variants_VariantId",
                table: "Bugs");

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Impacts_ImpactId",
                table: "Bugs",
                column: "ImpactId",
                principalTable: "Impacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Statuses_StatusId",
                table: "Bugs",
                column: "StatusId",
                principalTable: "Statuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bugs_Variants_VariantId",
                table: "Bugs",
                column: "VariantId",
                principalTable: "Variants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
