using Pepegov.MicroserviceFramework.AspNetCore.WebApplicationDefinition;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;

namespace Pepegov.Chat.Server.PL.EndPoints.Record;

public class RecordEndPoints : ApplicationDefinition
{
    public override Task ConfigureApplicationAsync(IDefinitionApplicationContext context)
    {
        var app = context.Parse<WebDefinitionApplicationContext>().WebApplication;
        app.MapPost("~/api/record-video", RecordVideo);
        return base.ConfigureApplicationAsync(context);
    }

    private async Task<IResult> RecordVideo(
        HttpContext httpContext)
    {
        var formCollection = await httpContext.Request.ReadFormAsync();
        var files = formCollection.Files;
        if (files.Any())
        {
            var file = files["video-blob"];
            string uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedRecordFiles");
            Directory.CreateDirectory(uploadFolder);
            string uniqueFileName = httpContext.User.Identity?.Name + "_" + DateTime.UtcNow.Year + "-" + DateTime.UtcNow.Month + "-" + DateTime.UtcNow.Minute + ".webm";
            string uploadPath = Path.Combine(uploadFolder, uniqueFileName);

            if (file is null)
            {
                return Results.BadRequest("No \"video-blob\" in form data");
            }
            
            using (var temp = new FileStream(uploadPath, FileMode.Create))
            {
                await file.CopyToAsync(temp);
            }
                    
            return Results.NoContent();
        }
        else
        {
            return Results.BadRequest("No file created");
        }
    }
}