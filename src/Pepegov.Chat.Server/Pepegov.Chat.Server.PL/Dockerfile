FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
#USER $APP_UID
WORKDIR /app
EXPOSE 11010
EXPOSE 11011

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Pepegov.Chat.Server.PL/Pepegov.Chat.Server.PL.csproj", "Pepegov.Chat.Server.PL/"]
COPY ["Pepegov.Chat.Server.BL/Pepegov.Chat.Server.BL.csproj", "Pepegov.Chat.Server.BL/"]
COPY ["Pepegov.Chat.Server.DAL/Pepegov.Chat.Server.DAL.csproj", "Pepegov.Chat.Server.DAL/"]
RUN dotnet restore "Pepegov.Chat.Server.PL/Pepegov.Chat.Server.PL.csproj"
COPY . .
WORKDIR "/src/Pepegov.Chat.Server.PL"
RUN dotnet build "Pepegov.Chat.Server.PL.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Pepegov.Chat.Server.PL.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=11010
ENV ASPNETCORE_HTTP_PORTS=11011
#ENV ASPNETCORE_URLS=https://+:11011;http://+:11010
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Pepegov.Chat.Server.PL.dll"]
