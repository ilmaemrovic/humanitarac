# Humanitarac API (dotnet minimal API)

This is a minimal backend for the Humanitarac project (development only). It uses in-memory storage and JWT authentication.

Requirements
- .NET 8 SDK (or .NET 7+; project targets net8.0)

Run

```bash
cd backend
dotnet restore
dotnet run
```

The API listens on the default Kestrel port (e.g., https://localhost:5001). The frontend expects endpoints under `/api/*` so run the frontend with a proxy or allow CORS (CORS is enabled).

Test accounts (seeded):

- Admins:
  - marko.ilic@example.com / adminpass1
  - aleksandar.v@example.com / adminpass2
- Users:
  - ilma.emrovic@example.com / userpass1
  - aldina.avdic@example.com / userpass2

Notes
- This is an in-memory demo server. Restarting the process clears data.
- Change `appsettings.json` JWT key for production use.
