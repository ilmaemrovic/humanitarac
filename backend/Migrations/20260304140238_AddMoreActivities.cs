using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HumanitaracApi.Migrations
{
    public partial class AddMoreActivities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a1",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 3, 4, 14, 2, 37, 959, DateTimeKind.Utc).AddTicks(7220), new DateTime(2026, 3, 1, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a2",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(2720), new DateTime(2026, 2, 22, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a3",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3250), new DateTime(2026, 2, 12, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020) });

            migrationBuilder.UpdateData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a4",
                columns: new[] { "CreatedAt", "Date" },
                values: new object[] { new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3270), new DateTime(2026, 2, 2, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020) });

            migrationBuilder.InsertData(
                table: "Activities",
                columns: new[] { "Id", "Category", "City", "Completed", "CreatedAt", "Date", "Description", "Title" },
                values: new object[,]
                {
                    { "a5", "Pomoć", "Niš", false, new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3290), new DateTime(2026, 2, 27, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020), "Obilazak i pomoć starijim sugrađanima u svakodnevnim aktivnostima.", "Podrška starijim osobama" },
                    { "a6", "Edukacija", "Kragujevac", false, new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3300), new DateTime(2026, 2, 17, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020), "Kreativne radionice za djecu i mlade u lokalnoj biblioteci.", "Radionica kreativnog pisanja" },
                    { "a7", "Volontiranje", "Novi Sad", false, new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3310), new DateTime(2026, 2, 24, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020), "Akcija sadnje 200 stabala u gradskom parku.", "Sadnja drveća" },
                    { "a8", "Krizna pomoć", "Prijepolje", false, new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3330), new DateTime(2026, 2, 7, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020), "Prikupljanje tople odjeće i obuće za socijalno ugrožene porodice.", "Prikupljanje odjeće za zimu" },
                    { "a9", "Pomoć", "Beograd", false, new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3340), new DateTime(2026, 2, 20, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020), "Organizacija besplatnih preventivnih zdravstvenih pregleda.", "Besplatni medicinski pregledi" },
                    { "a10", "Edukacija", "Novi Pazar", false, new DateTime(2026, 3, 4, 14, 2, 37, 960, DateTimeKind.Utc).AddTicks(3350), new DateTime(2026, 2, 25, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(8020), "Besplatni kursevi osnova programiranja za nezaposlene mlade.", "IT obuka za nezaposlene" }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_admin_1",
                column: "CreatedAt",
                value: new DateTime(2026, 3, 4, 14, 2, 37, 956, DateTimeKind.Utc).AddTicks(9190));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_admin_2",
                column: "CreatedAt",
                value: new DateTime(2026, 3, 4, 14, 2, 37, 957, DateTimeKind.Utc).AddTicks(8640));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_user_1",
                column: "CreatedAt",
                value: new DateTime(2026, 3, 4, 14, 2, 37, 957, DateTimeKind.Utc).AddTicks(9050));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "u_user_2",
                column: "CreatedAt",
                value: new DateTime(2026, 3, 4, 14, 2, 37, 957, DateTimeKind.Utc).AddTicks(9060));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a10");

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a5");

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a6");

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a7");

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a8");

            migrationBuilder.DeleteData(
                table: "Activities",
                keyColumn: "Id",
                keyValue: "a9");

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
    }
}
