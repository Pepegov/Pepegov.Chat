using System.Text.Json.Serialization;

namespace Pepegov.Chat.Server.DAL.ViewModels;

public class UserInfo
{
    [JsonPropertyName("birthdate")]
    public DateTime? Birthdate { get; set; }
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    [JsonPropertyName("email_verified")]
    public bool? EmailVerified { get; set; }
    [JsonPropertyName("phone_number")]
    public string? PhoneNumber { get; set; }
    [JsonPropertyName("phone_number_verified")]
    public bool? PhoneNumberVerified { get; set; }
    [JsonPropertyName("name")]
    public string? Name { get; set; } 
    [JsonPropertyName("given_name")]
    public string? GivenName { get; set; }
    [JsonPropertyName("family_name")]
    public string? FamilyName { get; set; }
    [JsonPropertyName("updated_at")]
    public DateTime? UpdatedAt { get; set; }
    [JsonPropertyName("gender")]
    public string? Gender { get; set; }
    [JsonPropertyName("nickname")]
    public string Nickname { get; set; } = null!;
    [JsonPropertyName("middle_name")]
    public string? MiddleName { get; set; }
    [JsonPropertyName("role")]
    public List<string>? Roles { get; set; }
}