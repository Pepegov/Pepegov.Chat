using Pepegov.Chat.Server.DAL.Domain;
using Pepegov.Chat.Server.PL.Definitions.Options.Models;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.Options;

public class OptionsDefinition : ApplicationDefinition
{
    public override async Task ConfigureServicesAsync(IDefinitionServiceContext context)
    {
        var identityConfiguration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile(AppData.IdentitySettingPath)
            .Build();

        context.ServiceCollection.Configure<IdentityAddressOption>(
            identityConfiguration.GetSection("IdentityServerUrl"));
        context.ServiceCollection.Configure<IdentityClientOption>(
            identityConfiguration.GetSection("CurrentIdentityClient"));
    }
}