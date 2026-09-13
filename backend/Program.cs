using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using HumanitaracApi.Data;

namespace HumanitaracApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            ApplyMigrations(host);
            host.Run();
        }

        // Apply pending EF migrations on startup so deployments (e.g. Railway) keep the schema up to date.
        // Failures are logged instead of crashing, so the API still starts if the database is unreachable.
        private static void ApplyMigrations(IHost host)
        {
            using var scope = host.Services.CreateScope();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            try
            {
                scope.ServiceProvider.GetRequiredService<HumanitaracDbContext>().Database.Migrate();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Database migration failed");
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
