using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Enums;
using backend.Hubs;
using backend.Services.admin;
using DotNetEnv;
using Npgsql;
using System.Text.Json.Serialization;
using backend.Services.auth;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

string connectionString =
    $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
    $"Port={Environment.GetEnvironmentVariable("DB_PORT")};" +
    $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
    $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
    $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")}";

var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.MapEnum<UserRole>("userrole");
var dataSource = dataSourceBuilder.Build();

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();
builder.Services.AddSignalR();
builder.Services.AddScoped<AdminAddEmployeeService>();
builder.Services.AddScoped<AdminHomePage>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AdminEditEmployeeService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(dataSource)
);

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .Select(e => new { field = e.Key, errors = e.Value.Errors.Select(x => x.ErrorMessage) });

            return new BadRequestObjectResult(new { message = "Validation failed", errors });
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();
app.UseCors("FrontendPolicy");
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();