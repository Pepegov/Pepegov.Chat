using System.Text.Json;
using Microsoft.AspNetCore.Authentication.Cookies;
using Pepegov.Chat.Server.DAL.Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Server.AspNetCore;
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
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
                options.Cookie.Name = ".Pepegov.Session";
                options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                
                options.LoginPath = "/connect/login";
                options.LogoutPath = "/connect/logout";
                options.AccessDeniedPath = "/connect/access-denied";
            })
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, "Bearer", options =>
            {
                options.SaveToken = true;
                options.Audience = currentClient.Id;
                options.Authority = url;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false, // Audience should be defined on the authorization server or disabled as shown
                    ClockSkew = new TimeSpan(0, 0, 30)
                };
                options.Events = new JwtBearerEvents
                {
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
                            context.Response.Headers.Add("x-token-expired", authenticationException?.Expires.ToString("o"));
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
        
        context.ServiceCollection.AddAuthorization(options =>
        {
            options.AddPolicy(AuthData.AuthenticationSchemes, policy =>
            {
                policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme, CookieAuthenticationDefaults.AuthenticationScheme);
                policy.RequireAuthenticatedUser();
                //policy.RequireClaim("scope", "api");
            });
        });

        context.ServiceCollection.AddSingleton<IAuthorizationPolicyProvider, AuthorizationPolicyProvider>();
        context.ServiceCollection.AddSingleton<IAuthorizationHandler, AppPermissionHandler>();
    }

    public override async Task ConfigureApplicationAsync(IDefinitionApplicationContext context)
    { 
        var app = context.Parse<WebDefinitionApplicationContext>().WebApplication;

        //app.UseHttpsRedirection();
        app.UseRouting();
        app.UseCors(AppData.PolicyName);
        app.UseAuthentication();
        app.UseAuthorization();

        // registering UserIdentity helper as singleton
        UserIdentity.Instance.Configure(app.Services.GetService<IHttpContextAccessor>()!);
    }
}