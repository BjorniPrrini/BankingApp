using Microsoft.EntityFrameworkCore;
using backend.Data;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
        $"Port={Environment.GetEnvironmentVariable("DB_PORT")};" +
        $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
        $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
        $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")}"
    )
);

var app = builder.Build();

if(app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();