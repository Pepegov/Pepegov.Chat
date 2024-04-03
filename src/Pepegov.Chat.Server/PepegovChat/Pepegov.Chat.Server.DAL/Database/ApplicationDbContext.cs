using Microsoft.EntityFrameworkCore;
using Pepegov.Chat.Server.DAL.Models;

namespace Pepegov.Chat.Server.DAL.Database;

public class ApplicationDbContext : DbContext
{
    public DbSet<Room> Rooms { get; set; } 

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}