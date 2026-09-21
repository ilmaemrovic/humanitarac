# Humanitarac DUNP - Humanitarian Project Management Platform

## 🎯 Project Overview

Humanitarac DUNP is a full-stack web application for managing humanitarian projects, activities, donations, and volunteer coordination. The project supports multiple regions in the Balkans and is designed to help coordinate charitable work and community support initiatives.

**Tech Stack:**
- **Frontend:** React 18 + Vite + React Router
- **Backend:** ASP.NET Core 5.0 + Entity Framework Core
- **Database:** MySQL 8.0
- **Authentication:** JWT (JSON Web Tokens)

---

## 🌐 Live Demo (Railway)

**https://humanitarac-production.up.railway.app**

| Role  | Email                        | Password     |
|-------|------------------------------|--------------|
| Admin | `marko.ilic@example.com`     | `adminpass1` |
| Admin | `aleksandar.v@example.com`   | `adminpass2` |
| User  | `ilma.emrovic@example.com`   | `userpass1`  |
| User  | `aldina.avdic@example.com`   | `userpass2`  |

- **Admin** accounts can create, edit, complete and delete activities, and manage participations, volunteers and contact messages (`/admin`).
- **User** accounts can donate, join activities and manage their own tasks (`/tasks`).
- New accounts can also be created via **Registracija**.

---

## ✅ Current Status: DEPLOYED

- **Hosting:** Railway, project `fearless-energy`, environment `production`
- **App service:** one Docker service that serves both the React frontend and the ASP.NET Core API (`/api/*`)
- **Database:** Railway MySQL service; EF Core migrations are applied automatically on startup
- **Deploys:** every push to `main` triggers a Railway build from the root `Dockerfile`
- **Tables:** Users, Activities, Donations, Volunteers, Participations, Contacts, TaskItems, __EFMigrationsHistory

---

## 🚀 Quick Start Guide

### Prerequisites
Ensure you have:
- Node.js 16+ (`node --version`)
- .NET 5.0 SDK (`dotnet --version`)
- Homebrew (on macOS)

### 1️⃣ Start MySQL Database
```bash
brew services start mysql@8.0
```

### 2️⃣ Start Backend API (Terminal 1)
```bash
cd backend
ASPNETCORE_ENVIRONMENT=Development dotnet run --project HumanitaracApi.csproj
```

The backend will start on: `http://localhost:5000`

### 3️⃣ Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

The frontend will start on: `http://localhost:5176`

### 4️⃣ Access the Application
Open your browser to: **http://localhost:5176**

---

## 👤 Test Accounts

These seeded accounts work both locally and on the [live demo](https://humanitarac-production.up.railway.app).

### Admin Account
```
Email: marko.ilic@example.com
Password: adminpass1
Role: Admin (can create/manage activities)
```

### Regular User Account
```
Email: ilma.emrovic@example.com
Password: userpass1
Role: User (can participate in activities)
```

---

## 📱 Application Features

### For All Users
- ✅ View projects and humanitarian activities
- ✅ Browse by city, category, and search
- ✅ Register and create account
- ✅ Login/Logout
- ✅ View activity details
- ✅ Submit contact forms

### For Authenticated Users
- ✅ Make donations
- ✅ Sign up as volunteer
- ✅ Join activities
- ✅ Manage personal tasks (create, edit, filter, complete, delete)
- ✅ View participation status
- ✅ Save preferences

### For Admin Users (Additional)
- ✅ Create new activities
- ✅ Edit/update activities
- ✅ Delete activities
- ✅ Manage volunteer applications
- ✅ View all donations
- ✅ View contact form submissions

---

## 📂 Project Structure

```
humanitarac-dunp/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── api/             # API client and endpoints
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utilities (auth, validation)
│   │   ├── styles/          # CSS stylesheets
│   │   ├── config/          # Configuration
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.local           # Frontend env vars
│   └── OPTIMIZATION.md      # Frontend optimization guide
│
├── backend/                 # ASP.NET Core Application
│   ├── Controllers/         # API endpoints
│   ├── Models/              # Data models
│   ├── Data/                # Database context
│   ├── Migrations/          # EF Core migrations
│   ├── Startup.cs           # Configuration
│   ├── Program.cs           # Entry point
│   ├── appsettings.json     # Config (production)
│   ├── appsettings.Development.json
│   └── HumanitaracApi.csproj
│
├── README.md                # This file
├── BACKEND_SETUP.md         # Backend documentation
├── TESTING.md               # Testing guide
└── OPTIMIZATION.md          # Optimization notes
```

---

## 🔌 API Integration

The frontend communicates with the backend via REST API:

**Base URL:** `http://localhost:5000/api`

### Key Endpoints
- `GET /api/activities` - List activities
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/donations` - Create donation
- `POST /api/volunteers` - Sign up volunteer
- `POST /api/activities/{id}/join` - Join activity
- `POST /api/contact` - Submit contact form

See [BACKEND_SETUP.md](BACKEND_SETUP.md) for full API documentation.

### GraphQL

Uz REST API, backend nudi i GraphQL endpoint (HotChocolate).

- **Endpoint:** `/graphql` — live: https://humanitarac-production.up.railway.app/graphql
- U browseru se otvara **Banana Cake Pop** UI za pisanje i izvršavanje upita.

Primjer upita:
```graphql
{
  activities {
    id
    title
    city
    category
    date
    completed
  }
}
```

Isti upit preko `curl`:
```bash
curl -X POST https://humanitarac-production.up.railway.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ activities { id title city } }"}'
```

Upit je definisan u `backend/GraphQL/Query.cs`, a registrovan u `Startup.cs`
(`AddGraphQLServer()` + `MapGraphQL()`).

---

## 🛠️ Development

### Database Setup (First Time)
```bash
cd backend

# Create migration (already done)
# dotnet-ef migrations add InitialCreate

# Apply migrations
dotnet-ef database update
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint           # Check for issues
npm run lint:fix       # Auto-fix issues
npm run format         # Format with Prettier
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
dotnet publish -c Release
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE Users (
  Id VARCHAR(50) PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Email VARCHAR(255) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role VARCHAR(50) NOT NULL,
  CreatedAt DATETIME NOT NULL
);
```

### Activities Table
```sql
CREATE TABLE Activities (
  Id VARCHAR(50) PRIMARY KEY,
  Title VARCHAR(255) NOT NULL,
  Description TEXT,
  City VARCHAR(100),
  Category VARCHAR(100),
  Date DATETIME,
  Completed BOOLEAN DEFAULT FALSE,
  CreatedAt DATETIME NOT NULL
);
```

### Other Tables
- **Donations** - Donation records with amount, method, donor info
- **Volunteers** - Volunteer registrations with interests/availability
- **Participations** - Activity participation records
- **Contacts** - Contact form submissions
- **__EFMigrationsHistory** - EF Core migration tracking

---

## 🔒 Authentication & Security

### JWT Tokens
- Token Duration: 60 minutes
- Issuer: `humanitarac.local`
- Includes: User ID, name, email, role

### Password Security
- Stored in database (should be hashed in production)
- Validated on login

### CORS
- Enabled for all origins in development
- Should be restricted to frontend domain in production

---

## 🚨 Common Issues & Solutions

### Frontend won't load
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### Backend port in use
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
cd backend
dotnet run --urls "http://localhost:5001"
```

### MySQL connection error
```bash
# Check MySQL status
brew services list | grep mysql

# Start MySQL
brew services start mysql@8.0

# Verify connection
mysql -u humanitarac -p humanitarac_db
```

### Database schema issues
```bash
cd backend

# Check migrations
dotnet-ef migrations list

# Reapply migrations
dotnet-ef database drop
dotnet-ef database update
```

---

## 📝 Configuration Files

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_MOCK_SERVER=false
VITE_LOG_LEVEL=debug
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=humanitarac_db;User=humanitarac;Password=humanitarac_pass"
  },
  "Jwt": {
    "Key": "secret_key_here",
    "Issuer": "humanitarac.local",
    "Audience": "humanitarac.local",
    "ExpireMinutes": 60
  }
}
```

---

## 🤝 Contributing

### Code Style
- Frontend: ESLint + Prettier (run `npm run format`)
- Backend: .NET conventions

### Making Changes
1. Create feature branch
2. Make changes
3. Test locally
4. Commit with clear messages
5. Push to repository

---

## 🚀 Deployment

### Railway (current)
The app is live at **https://humanitarac-production.up.railway.app**.

- Railway builds the root `Dockerfile`: it builds the frontend (with an empty `VITE_API_BASE_URL`, so API calls go to the same origin), publishes the backend, and serves the frontend from `wwwroot`.
- The backend listens on Railway's `$PORT` and applies pending EF Core migrations on startup.
- Required service variable: `ConnectionStrings__DefaultConnection` (points to the Railway MySQL service).
- To deploy, push to `main`; check status with `railway status` or in the Railway dashboard.

### Production Checklist
- [ ] Update JWT secret key
- [ ] Configure MySQL with proper backups
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Build frontend: `npm run build`
- [ ] Publish backend: `dotnet publish -c Release`
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure firewall
- [ ] Enable CORS for production domain
- [ ] Set up monitoring/logging
- [ ] Test all features

### Hosting Options
- **Frontend:** Vercel, Netlify, Azure Static Web Apps
- **Backend:** Azure App Service, AWS EC2, DigitalOcean
- **Database:** MySQL on cloud provider or managed MySQL service

---

## 📚 Documentation Files

- [BACKEND_SETUP.md](BACKEND_SETUP.md) - Detailed backend configuration and API documentation
- [TESTING.md](TESTING.md) - Testing guide with mock data and test accounts
- [OPTIMIZATION.md](frontend/OPTIMIZATION.md) - Frontend performance optimization notes

---

## 🆘 Support & Troubleshooting

### Getting Help
1. Check the relevant `.md` file for your issue
2. Review error logs in the terminal
3. Check browser console for frontend errors
4. Check terminal output for backend errors

### Useful Commands

**Frontend:**
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint:fix   # Fix linting issues
npm run format     # Format code
```

**Backend:**
```bash
dotnet run                 # Start server
dotnet build              # Build project
dotnet-ef migrations add  # Create migration
dotnet-ef database update # Apply migrations
```

**Database:**
```bash
# Connect to MySQL
mysql -u humanitarac -p humanitarac_db

# Common queries
SHOW TABLES;
SELECT * FROM Users;
SELECT * FROM Activities;
```

---

## 📞 Contact & Questions

For questions or issues about the project, refer to the documentation files:
- Backend issues → See BACKEND_SETUP.md
- Frontend issues → See frontend/OPTIMIZATION.md
- Testing → See TESTING.md

---

## 📅 Project Timeline

- **Feb 24, 2026:** Initial setup and configuration
- **Sep 13, 2026:** Tasks feature, bug fixes and deployment to Railway
- **Future:** Additional features

---

## 📄 License

This project is for humanitarian purposes. Usage should comply with applicable laws and regulations.

---

## ✨ Key Features Implemented

✅ User authentication with JWT  
✅ Activity/project management  
✅ Donation processing  
✅ Volunteer registration  
✅ Admin dashboard  
✅ Responsive design  
✅ Error handling & validation  
✅ Database migrations  
✅ API with proper error responses  
✅ Frontend optimization (code splitting, minification)  

---

**Version:** 0.1.0  
**Last Updated:** September 13, 2026  
**Status:** ✅ Deployed on Railway — https://humanitarac-production.up.railway.app
