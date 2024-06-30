using System.Reflection;
using Pepegov.Chat.Server.DAL.Database;
using Pepegov.Chat.Server.DAL.Domain;
using Microsoft.EntityFrameworkCore;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.Database
{
    public class DatabaseDefinition : ApplicationDefinition
    {
        public override async Task ConfigureServicesAsync(IDefinitionServiceContext context)
        {
            string migrationsAssembly = typeof(Program).GetTypeInfo().Assembly.GetName().Name!;
            string connectionString = context.Configuration.GetConnectionString("DefaultConnection")
                                      ??
                                      $"Server=localhost;Port=5432;User Id=postgres;Password=password;Database={AppData.ServiceName}";

            context.ServiceCollection.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString,
                    b => b.MigrationsAssembly(migrationsAssembly)));
        }
    }
}