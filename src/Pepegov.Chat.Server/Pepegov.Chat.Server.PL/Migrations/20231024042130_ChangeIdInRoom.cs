using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pepegov.Chat.Server.PL.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIdInRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RoomId",
                table: "Rooms",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Rooms",
                newName: "RoomId");
        }
    }
}
