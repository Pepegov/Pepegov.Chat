using Pepegov.Chat.Server.DAL.Domain;
using Pepegov.Chat.Server.PL.Definitions.Options.Models;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.Options;

public class OptionsDefinition : ApplicationDefinition
{
    public override async Task ConfigureServicesAsync(IDefinitionServiceContext context)
    {
        context.ServiceCollection.Configure<IdentityAddressOption>(
            context.Configuration.GetSection("IdentityServerUrl"));
        context.ServiceCollection.Configure<IdentityClientOption>(
            context.Configuration.GetSection("CurrentIdentityClient"));
    }
}