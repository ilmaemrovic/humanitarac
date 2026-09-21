using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using HumanitaracApi.Data;

namespace HumanitaracApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Database
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<HumanitaracDbContext>(options =>
                options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0)))
            );

            // JWT Authentication
            var jwtSection = Configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSection["Issuer"],
                    ValidAudience = jwtSection["Audience"],
                    IssuerSigningKey = key,
                    ClockSkew = TimeSpan.FromMinutes(5)
                };
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"JWT AUTH FAILED: {context.Exception.GetType().Name}: {context.Exception.Message}");
                        return System.Threading.Tasks.Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine($"JWT TOKEN VALIDATED for {context.Principal?.Identity?.Name}");
                        return System.Threading.Tasks.Task.CompletedTask;
                    }
                };
            });

            services.AddAuthorization();

            // CORS
            services.AddCors(options => options.AddDefaultPolicy(p =>
                p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()
            ));

            // <Nullable>enable</Nullable> would otherwise make every non-nullable DTO string implicitly
            // [Required], rejecting partial updates like { status: "done" }. Controllers validate explicitly.
            // GraphQL (endpoint /graphql)
            services.AddGraphQLServer().AddQueryType<HumanitaracApi.GraphQL.Query>();

            services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
                .ConfigureApiBehaviorOptions(options => {
                    options.SuppressModelStateInvalidFilter = false;
                })
                .AddJsonOptions(opts => {
                    opts.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
                });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Serve the built frontend from wwwroot when present (production Docker image)
            var hasFrontend = System.IO.File.Exists(System.IO.Path.Combine(env.WebRootPath ?? "", "index.html"));
            if (hasFrontend)
            {
                app.UseDefaultFiles();
                app.UseStaticFiles();
            }

            app.UseRouting();
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGraphQL();
                if (hasFrontend)
                {
                    // Client-side routes (e.g. /activities/a1) get index.html; unknown /api routes stay 404
                    endpoints.MapFallback(context =>
                    {
                        if (context.Request.Path.StartsWithSegments("/api"))
                        {
                            context.Response.StatusCode = 404;
                            return System.Threading.Tasks.Task.CompletedTask;
                        }
                        context.Response.ContentType = "text/html";
                        return context.Response.SendFileAsync(System.IO.Path.Combine(env.WebRootPath, "index.html"));
                    });
                }
            });
        }
    }
}
