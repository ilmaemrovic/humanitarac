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

# Expose port (Railway sets PORT dynamically)
EXPOSE 5000

# Set environment
ENV ASPNETCORE_ENVIRONMENT=Production

# Use shell form so $PORT is expanded at runtime
CMD ASPNETCORE_URLS=http://+:${PORT:-5000} dotnet HumanitaracApi.dll
