using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HumanitaracApi.Migrations
{
    public partial class AddVolunteerStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Volunteers",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a1",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 26, 16, 54, 14, 413, DateTimeKind.Utc).AddTicks(6350), new DateTime(2026, 2, 23, 16, 54, 14, 410, DateTimeKind.Utc).AddTicks(6660) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a2",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 26, 16, 54, 14, 414, DateTimeKind.Utc).AddTicks(3510), new DateTime(2026, 2, 16, 16, 54, 14, 410, DateTimeKind.Utc).AddTicks(6660) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a3",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 26, 16, 54, 14, 414, DateTimeKind.Utc).AddTicks(3980), new DateTime(2026, 2, 6, 16, 54, 14, 410, DateTimeKind.Utc).AddTicks(6660) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a4",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 26, 16, 54, 14, 414, DateTimeKind.Utc).AddTicks(4000), new DateTime(2026, 1, 27, 16, 54, 14, 410, DateTimeKind.Utc).AddTicks(6660) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_admin_1",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 16, 54, 14, 410, DateTimeKind.Utc).AddTicks(7810));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_admin_2",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 16, 54, 14, 411, DateTimeKind.Utc).AddTicks(6720));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_user_1",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 16, 54, 14, 411, DateTimeKind.Utc).AddTicks(7110));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_user_2",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 16, 54, 14, 411, DateTimeKind.Utc).AddTicks(7120));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Volunteers");

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a1",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 24, 20, 2, 17, 106, DateTimeKind.Utc).AddTicks(9860), new DateTime(2026, 2, 21, 20, 2, 17, 104, DateTimeKind.Utc).AddTicks(5850) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a2",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 24, 20, 2, 17, 107, DateTimeKind.Utc).AddTicks(8530), new DateTime(2026, 2, 14, 20, 2, 17, 104, DateTimeKind.Utc).AddTicks(5850) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a3",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 24, 20, 2, 17, 107, DateTimeKind.Utc).AddTicks(8960), new DateTime(2026, 2, 4, 20, 2, 17, 104, DateTimeKind.Utc).AddTicks(5850) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a4",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 2, 24, 20, 2, 17, 107, DateTimeKind.Utc).AddTicks(8980), new DateTime(2026, 1, 25, 20, 2, 17, 104, DateTimeKind.Utc).AddTicks(5850) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_admin_1",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 20, 2, 17, 104, DateTimeKind.Utc).AddTicks(6960));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_admin_2",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 20, 2, 17, 105, DateTimeKind.Utc).AddTicks(760));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_user_1",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 20, 2, 17, 105, DateTimeKind.Utc).AddTicks(1100));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_user_2",
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 20, 2, 17, 105, DateTimeKind.Utc).AddTicks(1110));
        }
    }
}
