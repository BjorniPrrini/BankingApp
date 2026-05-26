using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<TransactionHistory> TransactionHistories { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            foreach (var property in entityType.GetProperties())
                if (property.ClrType.IsEnum)
                {
                    var type = typeof(EnumToStringConverter<>).MakeGenericType(property.ClrType);
                    var converter = (ValueConverter)Activator.CreateInstance(type)!;
                    property.SetValueConverter(converter);
                }

        modelBuilder.Entity<User>().ToTable("users");
        modelBuilder.Entity<Client>().ToTable("client");
        modelBuilder.Entity<Employee>().ToTable("employee");
        modelBuilder.Entity<TransactionHistory>().ToTable("transactionhistory");
        modelBuilder.Entity<Notification>().ToTable("notifications");
        modelBuilder.Entity<AuditLog>().ToTable("auditlog");

        modelBuilder.Entity<User>().Property(u => u.dateCreated)
            .HasColumnName("datecreated")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<Client>(entity =>
        {
            entity.ToTable("client");

            entity.HasKey(c => c.id);

            entity.Property(c => c.id)
                .ValueGeneratedNever();

            entity.Property(c => c.accountNumber)
                .HasColumnName("accountnumber")
                .ValueGeneratedOnAdd();

            entity.Property(c => c.client_id)
                .HasColumnName("client_id")
                .ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<Employee>().Property(e => e.employee_id).HasColumnName("employee_id");

        modelBuilder.Entity<TransactionHistory>().Property(t => t.senderID).HasColumnName("senderid");
        modelBuilder.Entity<TransactionHistory>().Property(t => t.receiverID).HasColumnName("receiverid");
        modelBuilder.Entity<TransactionHistory>().Property(t => t.transactionTimestamp)
            .HasColumnName("transactiontimestamp")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Notification>().Property(n => n.userID).HasColumnName("userid");
        modelBuilder.Entity<Notification>().Property(n => n.isRead).HasColumnName("isread");
        modelBuilder.Entity<Notification>().Property(n => n.createdAt)
            .HasColumnName("createdat")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<AuditLog>().Property(a => a.userID).HasColumnName("userid");
        modelBuilder.Entity<AuditLog>().Property(a => a.createdAt)
            .HasColumnName("createdat")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<Client>()
            .HasOne(c => c.User).WithOne().HasForeignKey<Client>(c => c.id);

        modelBuilder.Entity<Employee>()
            .HasOne(e => e.User).WithOne().HasForeignKey<Employee>(e => e.id);

        modelBuilder.Entity<TransactionHistory>()
            .HasOne(t => t.Sender).WithMany().HasForeignKey(t => t.senderID)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TransactionHistory>()
            .HasOne(t => t.Receiver).WithMany().HasForeignKey(t => t.receiverID)
            .OnDelete(DeleteBehavior.Restrict);
    }
}