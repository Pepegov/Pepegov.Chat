using Pepegov.Chat.Server.BL.Hubs;
using Pepegov.MicroserviceFramework.AspNetCore.WebApplicationDefinition;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.SignalR;

public class SignalRDefinition : ApplicationDefinition
{
    public override Task ConfigureApplicationAsync(IDefinitionApplicationContext context)
    {
        var app = context.Parse<WebDefinitionApplicationContext>().WebApplication;
        // app.MapHub<PresenceHub>("hubs/presence").WithOpenApi();
        // app.MapHub<ChatHub>("hubs/chathub").WithOpenApi();
         return base.ConfigureApplicationAsync(context);
    }

    public override Task ConfigureServicesAsync(IDefinitionServiceContext context)
    {
        context.ServiceCollection.AddSignalR();
        context.ServiceCollection.AddSingleton<UserShareScreenTracker>();
        context.ServiceCollection.AddSingleton<PresenceTracker>();
        return base.ConfigureServicesAsync(context);
    }
}