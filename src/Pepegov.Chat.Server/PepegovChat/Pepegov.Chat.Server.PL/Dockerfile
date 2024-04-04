FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 11000
EXPOSE 11001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["PepegovChat/Pepegov.Chat.Server.PL/Pepegov.Chat.Server.PL.csproj", "PepegovChat/Pepegov.Chat.Server.PL/"]
COPY ["PepegovChat/Pepegov.Chat.Server.BL/Pepegov.Chat.Server.BL.csproj", "PepegovChat/Pepegov.Chat.Server.BL/"]
COPY ["PepegovChat/Pepegov.Chat.Server.DAL/Pepegov.Chat.Server.DAL.csproj", "PepegovChat/Pepegov.Chat.Server.DAL/"]
RUN dotnet restore "PepegovChat/Pepegov.Chat.Server.PL/Pepegov.Chat.Server.PL.csproj"
COPY . .
WORKDIR "/src/PepegovChat/Pepegov.Chat.Server.PL"
RUN dotnet build "Pepegov.Chat.Server.PL.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Pepegov.Chat.Server.PL.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_URLS=https://+:11011;http://+:11010
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Pepegov.Chat.Server.PL.dll"]
