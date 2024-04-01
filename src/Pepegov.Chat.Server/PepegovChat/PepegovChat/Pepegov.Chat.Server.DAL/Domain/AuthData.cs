using Microsoft.AspNetCore.Authentication.Cookies;
using OpenIddict.Validation.AspNetCore;

namespace Pepegov.Chat.Server.DAL.Domain;

/// <summary>
/// Data for authorization
/// </summary>
public class AuthData
{
    /// <summary>
    /// Schemes for authorization filter
    /// </summary>
    public const string AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme + "," + OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
}