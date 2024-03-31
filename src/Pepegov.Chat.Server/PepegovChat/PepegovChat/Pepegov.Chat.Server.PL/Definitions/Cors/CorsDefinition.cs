using Pepegov.Chat.Server.DAL.Domain;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.Cors;

/// <summary>
/// Cors configurations
/// </summary>
public class CorsDefinition : ApplicationDefinition
{
    public override async Task ConfigureServicesAsync(IDefinitionServiceContext context)
    {
        var origins = context.Configuration.GetSection("Cors")?.GetSection("Origins")?.Value?.Split(',');
        context.ServiceCollection.AddCors(options =>
        {
            options.AddPolicy(AppData.PolicyName,
                builder =>
                {
                    builder.WithOrigins("https://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    
                    return;

                    //builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                    
                    var origins = context.Configuration.GetSection("Cors")?.GetSection("Origins")?.Value?.Split(',');
                    context.ServiceCollection.AddCors(options =>
                    {
                        options.AddPolicy(AppData.PolicyName, builder =>
                        {
                            builder.AllowAnyHeader();
                            builder.AllowAnyMethod();
                            if (origins is not { Length: > 0 })
                            {
                                return;
                            }

                            if (origins.Contains("*"))
                            {
                                builder.AllowAnyHeader();
                                builder.AllowAnyMethod();
                                builder.AllowAnyOrigin(); 
                                builder.SetIsOriginAllowed(host => true);
                                //builder.AllowCredentials();
                            }
                            else
                            {
                                foreach (var origin in origins)
                                {
                                    builder.WithOrigins(origin);
                                }
                            }
                        });
                    });
                });
        });
    }
}