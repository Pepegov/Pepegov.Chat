using Microsoft.AspNetCore.Http.Connections;
using Pepegov.Chat.Server.BL.Hubs;
using Pepegov.MicroserviceFramework.AspNetCore.WebApplicationDefinition;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.Base;

/// <summary>
/// AspNetCore common configuration
/// </summary>
public class CommonDefinition : ApplicationDefinition
{
    public override async Task ConfigureApplicationAsync(IDefinitionApplicationContext context)
    {
        var app = context.Parse<WebDefinitionApplicationContext>().WebApplication;
        //app.UseDefaultFiles();
        //app.UseStaticFiles();
        //app.UseHttpsRedirection();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<PresenceHub>("hubs/presence").WithOpenApi();
            endpoints.MapHub<ChatHub>("hubs/chathub").WithOpenApi();
        });
    }

    public override async Task ConfigureServicesAsync(IDefinitionServiceContext context)
    {
        context.ServiceCollection.AddSignalR();
        context.ServiceCollection.AddControllers();
        context.ServiceCollection.AddLocalization();
        context.ServiceCollection.AddHttpContextAccessor();
        context.ServiceCollection.AddResponseCaching();
    }
}