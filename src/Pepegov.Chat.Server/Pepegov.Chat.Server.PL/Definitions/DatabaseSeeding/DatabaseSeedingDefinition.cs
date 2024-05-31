using Pepegov.Chat.Server.DAL.Database;
using Pepegov.MicroserviceFramework.AspNetCore.WebApplicationDefinition;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;
using Serilog;

namespace Pepegov.Chat.Server.PL.Definitions.DatabaseSeeding;

public class DatabaseSeedingDefinition : ApplicationDefinition
{
    public override async Task ConfigureApplicationAsync(IDefinitionApplicationContext context)
    {
        using var scope = context.ServiceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetService<ApplicationDbContext>()!;

        //await new DAL.Database.DatabaseInitializer(context.ServiceProvider, dbContext).SeedAsync();
    }
}