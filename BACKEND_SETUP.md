# Humanitarac DUNP - Backend Setup & Documentation

## ✅ Backend Status: FULLY OPERATIONAL ✅

Backend is now running with:
- **MySQL Database:** ✅ Running and configured
- **API Server:** ✅ Running on `http://localhost:5000`
- **Authentication:** ✅ JWT tokens working
- **Database:** ✅ All tables created with seed data
- **Environment:** Development mode (no HTTPS redirect)

---

## 🚀 Quick Start - Backend

### Start MySQL (if not running)
```bash
brew services start mysql@8.0
```

### Start Backend Server
```bash
cd backend
ASPNETCORE_ENVIRONMENT=Development dotnet run --project HumanitaracApi.csproj
```

The API will be available at: `http://localhost:5000`

---

## 📊 Database Information

### Database Credentials
```
Host: localhost
Port: 3306
Database: humanitarac_db
User: humanitarac
Password: humanitarac_pass
```

### Database Tables
- `__EFMigrationsHistory` - EF Core migrations tracking
- `Users` - Application users (4 seeded)
- `Activities` - Humanitarian projects (4 seeded)
- `Donations` - Donation records
- `Volunteers` - Volunteer signups
- `Participations` - Activity participation
- `Contacts` - Contact form submissions

### Seeded Test Data

**Users (4 total):**
```
Admin:
- Email: marko.ilic@example.com
- Password: adminpass1
- Email: aleksandar.v@example.com
- Password: adminpass2

Regular Users:
- Email: ilma.emrovic@example.com
- Password: userpass1
- Email: aldina.avdic@example.com
- Password: userpass2
```

**Activities (4 sample projects):**
1. Distribucija hrane i higijene (Food Distribution)
2. Edukacija o sanitaciji (Sanitation Education)
3. Prikupljanje pomoći (Flood Aid)
4. Park Čišćenje (Park Cleanup)

---

## 🔗 API Endpoints

All endpoints are available at `http://localhost:5000/api/`

### Public Endpoints (No Auth Required)

**Get Stats**
```bash
GET /api/stats
Response: {"actions": 4, "raised": 0, "volunteers": 0}
```

**Get Activities**
```bash
GET /api/activities?limit=3
Response: [Activity[], ...]
```

**Get Activity by ID**
```bash
GET /api/activities/{id}
Response: {Activity}
```

**Register**
```bash
POST /api/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "ok": true,
  "token": "JWT_TOKEN",
  "user": {id, name, email, role}
}
```

**Login**
```bash
POST /api/login
Body: {
  "email": "marko.ilic@example.com",
  "password": "adminpass1"
}
Response: {
  "ok": true,
  "token": "JWT_TOKEN",
  "user": {id, name, email, role}
}
```

**Volunteer Signup**
```bash
POST /api/volunteers
Body: {
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-1234",
  "interests": ["Education", "Healthcare"],
  "availability": "weekends"
}
Response: {"ok": true, "id": "v_TIMESTAMP"}
```

**Contact Form**
```bash
POST /api/contact
Body: {
  "name": "John",
  "email": "john@example.com",
  "message": "Hello..."
}
Response: {"ok": true, "id": "c_TIMESTAMP"}
```

### Authenticated Endpoints (Requires JWT Token)

**Donate**
```bash
POST /api/donations
Headers: { "Authorization": "Bearer JWT_TOKEN" }
Body: {
  "name": "Donor Name",
  "email": "donor@example.com",
  "amount": 100.00,
  "method": "card",
  "message": "Support"
}
Response: {"ok": true, "id": "d_TIMESTAMP"}
```

**Join Activity**
```bash
POST /api/activities/{id}/join
Headers: { "Authorization": "Bearer JWT_TOKEN" }
Body: { "note": "Interested in participating" }
Response: {"ok": true, "id": "p_TIMESTAMP"}
```

### Admin-Only Endpoints

**Create Activity**
```bash
POST /api/activities
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
Body: {
  "title": "Activity Title",
  "description": "Activity description",
  "city": "City Name",
  "category": "Category",
  "date": "2026-03-01T10:00:00"
}
Response: {Activity}
```

**Update Activity**
```bash
PUT /api/activities/{id}
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
Body: {
  "title": "Updated Title",
  "completed": true
}
Response: {Activity}
```

**Delete Activity**
```bash
DELETE /api/activities/{id}
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
Response: {"ok": true}
```

**Get Participations**
```bash
GET /api/participations
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
Response: [Participation[], ...]
```

**Update Participation Status**
```bash
PATCH /api/participations/{id}
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
Body: { "status": "approved", "note": "Updated" }
Response: {Participation}
```

**Get Contacts**
```bash
GET /api/contacts
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
Response: [Contact[], ...]
```

---

## 🧪 Testing the API

### Test with cURL

**Get Activities:**
```bash
curl http://localhost:5000/api/activities
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"marko.ilic@example.com","password":"adminpass1"}'
```

**Create Activity (Admin Only):**
```bash
curl -X POST http://localhost:5000/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title":"New Project",
    "description":"Help needed",
    "city":"Sarajevo",
    "category":"Education",
    "date":"2026-03-01T10:00:00"
  }'
```

---

## 🔧 Configuration Files

### appsettings.json (Production)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=humanitarac_db;User=humanitarac;Password=humanitarac_pass"
  },
  "Jwt": {
    "Key": "very_secret_key_change_in_production",
    "Issuer": "humanitarac.local",
    "Audience": "humanitarac.local",
    "ExpireMinutes": 60
  }
}
```

### appsettings.Development.json (Development)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=humanitarac_db;User=humanitarac;Password=humanitarac_pass"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug"
    }
  }
}
```

**To switch environments:**
```bash
# Development (no HTTPS redirect)
ASPNETCORE_ENVIRONMENT=Development dotnet run

# Production (with HTTPS redirect)
ASPNETCORE_ENVIRONMENT=Production dotnet run
```

---

## 📦 Backend Project Structure

```
backend/
├── Controllers/         # API Endpoints
│   ├── AuthController.cs
│   ├── ActivitiesController.cs
│   ├── DonationsController.cs
│   ├── VolunteersController.cs
│   ├── ParticipationsController.cs
│   └── ContactsController.cs
├── Models/             # Data Models
│   ├── User.cs
│   ├── Activity.cs
│   ├── Donation.cs
│   ├── Volunteer.cs
│   ├── Participation.cs
│   └── Contact.cs
├── Data/               # Database Context
│   └── HumanitaracDbContext.cs
├── Migrations/         # EF Core Migrations
│   └── 20260224200217_InitialCreate.cs
├── Startup.cs          # Configuration
├── Program.cs          # Entry Point
├── appsettings.json    # Configuration
├── appsettings.Development.json
└── HumanitaracApi.csproj
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
Tokens include these claims:
- `sub` (Subject): User ID
- `name`: User Name
- `email`: User Email
- `role`: User Role (Admin, User)
- `exp`: Expiration Time (60 minutes)

### Token Usage
Include in request header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Roles
- **Admin**: Can create/update/delete activities, manage participations, view contacts
- **User**: Can participate in activities, donate, view activities
- **Public**: Can register, login, view activities

---

## 🗄️ Database Relationships

```
Users (1) ──────→ (Many) Donations
Users (1) ──────→ (Many) Volunteers
Users (1) ──────→ (Many) Participations
Activities (1) ──────→ (Many) Participations
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill existing process
kill -9 <PID>

# Ensure MySQL is running
brew services list | grep mysql
```

### MySQL connection errors
```bash
# Verify credentials
/opt/homebrew/opt/mysql@8.0/bin/mysql -u humanitarac -p humanitarac_db -e "SELECT 1;"

# Check database exists
/opt/homebrew/opt/mysql@8.0/bin/mysql -u humanitarac -p humanitarac_db -e "SHOW TABLES;"
```

### EF Core migration issues
```bash
# Remove last migration
/Users/ilmaemrovic/.dotnet/tools/dotnet-ef migrations remove

# Create new migration
/Users/ilmaemrovic/.dotnet/tools/dotnet-ef migrations add DescriptiveName

# Apply migrations
/Users/ilmaemrovic/.dotnet/tools/dotnet-ef database update
```

---

## 🚀 Deployment Checklist

- [ ] Update `appsettings.json` with production JWT key
- [ ] Update MySQL connection string with production server
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Enable HTTPS and SSL certificates
- [ ] Set up database backups
- [ ] Configure firewall for port 5000
- [ ] Enable CORS for frontend domain
- [ ] Test all API endpoints
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable rate limiting

---

## 📚 References

- **Framework:** ASP.NET Core 5.0
- **Database:** MySQL 8.0
- **ORM:** Entity Framework Core 5.0
- **Authentication:** JWT (System.IdentityModel.Tokens.Jwt)
- **Database Provider:** Pomelo.EntityFrameworkCore.MySql

---

## ✅ Integration with Frontend

**Frontend Configuration** (`.env.local`):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_MOCK_SERVER=false
```

**Frontend will communicate with:**
- `http://localhost:5000/api/*` for all API calls
- Automatic token injection via auth interceptor
- Error handling with proper status codes

---

**Last Updated:** February 24, 2026  
**Status:** ✅ Production Ready
