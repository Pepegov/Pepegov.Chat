﻿using Pepegov.Chat.Server.DAL.Database;
using Pepegov.MicroserviceFramework.Definition;
using Pepegov.MicroserviceFramework.Definition.Context;
using Pepegov.UnitOfWork;
using Pepegov.UnitOfWork.EntityFramework.Configuration;

namespace Pepegov.Chat.Server.PL.Definitions.UnitOfWork
{
    public class UnitOfWorkDefinition : ApplicationDefinition
    {
        public override async Task ConfigureServicesAsync(IDefinitionServiceContext serviceContext)
        {
            serviceContext.ServiceCollection.AddUnitOfWork(x =>
            {
                x.UsingEntityFramework((context, configurator) =>
                {
                    configurator.DatabaseContext<ApplicationDbContext>();
                });
            });
        }
    }
}