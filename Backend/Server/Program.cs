using Microsoft.EntityFrameworkCore;
using ChessSweeper.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Allow cross-origin requests during development from local frontends
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
    options.AddPolicy("AllowStaticWebsite", policy =>
    {
        policy.WithOrigins("https://thankful-plant-08ce5741e.1.azurestaticapps.net/")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register EF Core DbContext with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Apply any pending migrations at startup (safe for development). Errors are logged but won't crash the app.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var db = services.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetService<ILogger<Program>>();
        logger?.LogError(ex, "An error occurred while migrating the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS - must be before MapControllers/Authorization
app.UseCors("DevCors");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

Console.WriteLine("Server is running..." + app.Environment.EnvironmentName);
