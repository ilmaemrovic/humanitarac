# Build stage
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

WORKDIR /app

# Copy backend project files
COPY backend/HumanitaracApi.csproj ./
RUN dotnet restore

# Copy source code
COPY backend/ .

# Build
RUN dotnet build HumanitaracApi.csproj -c Release -o /app/build

# Publish
RUN dotnet publish HumanitaracApi.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:5.0

WORKDIR /app

# Copy from build stage
COPY --from=build /app/publish .

# Expose port
EXPOSE 5000

# Set environment
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/activities || exit 1

ENTRYPOINT ["dotnet", "HumanitaracApi.dll"]
