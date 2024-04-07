using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Server.AspNetCore;
using Pepegov.Chat.Server.BL.Hubs;
using Pepegov.Chat.Server.PL.Definitions.OpenIddict;
using Pepegov.Chat.Server.PL.Definitions.Options.Models;
using Pepegov.MicroserviceFramework.AspNetCore.WebApplicationDefinition;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.Definitions.Identity;

/// <summary>
/// Authorization Policy registration
/// </summary>
public class AuthorizationDefinition : ApplicationDefinition
{
    public new int Priority = 8;
    
    public override async Task ConfigureServicesAsync(IDefinitionServiceContext context)
    {
        var url = context.Configuration.GetSection("IdentityServerUrl").GetValue<string>("Authority");
        var currentClient = context.Configuration.GetSection("CurrentIdentityClient").Get<IdentityClientOption>()!;

        context.ServiceCollection
            .AddAuthentication(options =>
            {
                options.DefaultScheme = OpenIddictServerAspNetCoreDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIddictServerAspNetCoreDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = OpenIddictServerAspNetCoreDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme, "Bearer", options =>
            {
                options.SaveToken = true;
                options.Audience = "client-id-code";
                options.Authority = url;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false, // Audience should be defined on the authorization server or disabled as shown
                    ClockSkew = new TimeSpan(0, 0, 30)
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    },
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";

                        // Ensure we always have an error and error description.
                        if (string.IsNullOrEmpty(context.Error))
                        {
                            context.Error = "invalid_token";
                        }

                        if (string.IsNullOrEmpty(context.ErrorDescription))
                        {
                            context.ErrorDescription = "This request requires a valid JWT access token to be provided";
                        }

                        // Add some extra context for expired tokens.
                        if (context.AuthenticateFailure != null && context.AuthenticateFailure.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            var authenticationException = context.AuthenticateFailure as SecurityTokenExpiredException;
                            context.Response.Headers.Append("x-token-expired", authenticationException?.Expires.ToString("o"));
                            context.ErrorDescription = $"The token expired on {authenticationException?.Expires:o}";
                        }

                        return context.Response.WriteAsync(JsonSerializer.Serialize(new
                        {
                            error = context.Error,
                            error_description = context.ErrorDescription
                        }));
                    }
                };
            });
        
        context.ServiceCollection.AddAuthorization();

        context.ServiceCollection.AddSingleton<IAuthorizationPolicyProvider, AuthorizationPolicyProvider>();
        context.ServiceCollection.AddSingleton<IAuthorizationHandler, AppPermissionHandler>();
    }

    public override async Task ConfigureApplicationAsync(IDefinitionApplicationContext context)
    { 
        var app = context.Parse<WebDefinitionApplicationContext>().WebApplication;

        //app.UseHttpsRedirection();
        app.UseRouting();
        //app.UseCors(AppData.PolicyName);
        app.UseCors(c => c.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
        app.UseAuthentication();
        app.UseAuthorization();
        
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHub<PresenceHub>("hubs/presence").WithOpenApi();
            endpoints.MapHub<ChatHub>("hubs/chathub").WithOpenApi();
        });

        // registering UserIdentity helper as singleton
        UserIdentity.Instance.Configure(app.Services.GetService<IHttpContextAccessor>()!);
    }
}