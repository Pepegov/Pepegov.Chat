using Pepegov.Chat.Server.BL.Interfaces;
using Pepegov.Chat.Server.BL.Services;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.Services;

public class ServicesDefinition : ApplicationDefinition
{
    public override Task ConfigureServicesAsync(IDefinitionServiceContext context)
    {
        context.ServiceCollection.AddScoped<IRoomService, RoomService>();
        return base.ConfigureServicesAsync(context);
    }
}