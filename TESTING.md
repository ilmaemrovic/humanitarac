# Humanitarac DUNP - Testing Guide

## ✅ Current Status

### Frontend ✅ RUNNING
- **URL:** http://localhost:5176
- **Status:** Active and serving with mock API
- **Port:** 5176 (dynamically assigned, started on 5173 but ports were in use)
- **Configuration:** Using mock server for development (`VITE_ENABLE_MOCK_SERVER=true`)

### Backend 🔧 READY (MySQL/Database Required)
- **Status:** Compilable and runnable
- **Database:** Configured for SQLite (development) or MySQL (production)
- **Port:** 5000 (or will auto-increment if in use)
- **Framework:** ASP.NET Core 5.0 with Entity Framework Core
- **Build:** ✅ Clean build - 65 warnings (nullable reference types, non-blocking)

## 🚀 Quick Start Guide

### Option 1: Frontend Only (Mock API) - READY NOW
```bash
# Terminal 1: Start Frontend
cd frontend
npm run dev
# Opens http://localhost:5176

# The frontend is fully functional with mock data:
# - Mock activities with sample humanitarian projects
# - Mock user accounts for testing
# - Working authentication flow
# - API response simulation with ~400-900ms realistic delays
```

**Test Account:**
- Email: `marko.ilic@example.com`
- Password: `adminpass1`
- Role: Admin

**Features Available:**
- ✅ View activities/projects
- ✅ Login/Registration
- ✅ Donate (form submission)
- ✅ Volunteer signup
- ✅ Admin dashboard (with admin account)
- ✅ Contact form
- ✅ All pages and navigation

### Option 2: Full Stack (Frontend + Backend with SQLite) - COMING SOON

```bash
# Terminal 1: Start Backend
cd backend
export ASPNETCORE_ENVIRONMENT=Development
dotnet run --project HumanitaracApi.csproj

# Terminal 2: Start Frontend
cd frontend
# Update .env.local
VITE_ENABLE_MOCK_SERVER=false
npm run dev
```

**Backend Ports:**
- HTTP: `http://localhost:5000` (standard)
- Or: `http://localhost:5001` (if 5000 in use)

### Option 3: Production (Frontend + Backend with MySQL)

```bash
# Update backend appsettings.json with MySQL connection
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-mysql-host;Port=3306;Database=humanitarac_db;User=user;Password=pass"
  }
}

# Build production
cd backend
dotnet publish -c Release

cd frontend
npm run build
```

## 📊 Mock Server Features

The frontend includes a complete mock server for testing:

### Mock Endpoints Available:
- ✅ `GET/POST /api/activities`
- ✅ `GET/POST /api/donations`
- ✅ `POST /api/register`
- ✅ `POST /api/login`
- ✅ `POST /api/volunteers`
- ✅ `POST /api/contact`
- ✅ `GET /api/stats`
- ✅ And all others in [endpoints.js](src/api/endpoints.js)

###Mock Data:
```javascript
// 4 Sample Activities
- Distribucija hrane i higijene (Food Distribution)
- Edukacija o sanitaciji (Sanitation Education)
- Prikupljanje pomoći za poplave (Flood Aid)
- Volonterski dan: Park Čišćenje (Park Cleanup)

// 8 Test Users
- 2 Admins
- 2 Regular Users
- 2 Volunteers
- 2 Donors

// Sample: Login with admin
Email: marko.ilic@example.com
Password: adminpass1
```

## 🔍 Fixed Issues

### ✅ Frontend
- Fixed missing React imports in `useApi.js` and `App.jsx`
- Added ErrorBoundary to prevent full app crashes
- Optimized with code splitting and minification
- Added proper error handling middleware

### ✅ Backend
- Fixed incorrect `using System.Collections.Linq` → `using System.Linq`
- Added SQLite support for local development
- Configured environment-based database selection:
  - Development: SQLite (`humanitarac_dev.db`)
  - Production: MySQL (configurable)
- JWT authentication ready
- CORS enabled for frontend requests

## 🔧 Configuration Files

### Frontend
- **`.env.local`** - Local environment variables
  ```env
  VITE_API_BASE_URL=http://localhost:5000
  VITE_ENABLE_MOCK_SERVER=true  # Set to false for real API
  VITE_LOG_LEVEL=debug
  ```

- **`vite.config.js`** - Build optimizations
- **`.eslintrc.json`** - Code quality rules
- **`.prettierrc.json`** - Code formatting

### Backend
- **`appsettings.json`** - Default/production config
- **`appsettings.Development.json`** - Development config
- **Database:** Automatically uses SQLite in Development

## 📋 Next Steps

### Immediate (5 minutes)
1. Open http://localhost:5176 in browser
2. Login with: `marko.ilic@example.com` / `adminpass1`
3. Explore the application

### Short Term (15 minutes)
1. Test all pages and features
2. Try creating activities (as admin)
3. Test donation and volunteer flows
4. Check validation and error handling

### Backend Setup (Optional)
1. Ensure .NET 5.0+ SDK is installed: `dotnet --version`
2. Run backend: `dotnet run --project HumanitaracApi.csproj`
3. Update frontend `.env.local`: `VITE_ENABLE_MOCK_SERVER=false`
4. Test real API endpoints

### Production Deployment
1. Setup MySQL database
2. Update `appsettings.json` connection string
3. Build backend: `dotnet publish -c Release`
4. Build frontend: `npm run build`
5. Deploy to production server

## 🎯 Testing Checklist

### Frontend Pages
- [ ] Home page loads with stats and featured activities
- [ ] About page renders
- [ ] Activities page shows all projects with filters
- [ ] Individual activity detail page works
- [ ] Donate form works
- [ ] Volunteer signup form works
- [ ] Registration page functional
- [ ] Login/Logout flow works
- [ ] Admin dashboard visible to admins only
- [ ] Navigation and routing all working
- [ ] Mobile responsive

### Authentication
- [ ] Register new account
- [ ] Login with registered account
- [ ] Logout clears session
- [ ] Token persists on page reload
- [ ] Invalid credentials rejected

### Forms & Validation
- [ ] Donation form validates before submit
- [ ] Volunteer form validates fields
- [ ] Registration validates email format
- [ ] Contact form accepts messages
- [ ] Error messages appear on failures

### API Integration (When Backend Ready)
- [ ] Activities fetch from real API
- [ ] Stats update from backend
- [ ] Authentication tokens work
- [ ] Donations are saved
- [ ] Volunteer signups recorded

## 💡 Troubleshooting

### Frontend Not Loading
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### Port Already in Use
```bash
# Kill process on port
lsof -i :5176 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Backend Won't Start
```bash
# Ensure .NET SDK is installed
dotnet --version

# Try specifying Development environment
ASPNETCORE_ENVIRONMENT=Development dotnet run

# Check for port conflicts
lsof -i :5000
```

## 🔗 Important URLs & Files

| Resource | Location |
|----------|----------|
| Frontend App | `http://localhost:5176` |
| Backend API | `http://localhost:5000` |
| Frontend Config | [`.env.local`](frontend/.env.local) |
| Backend Config | [`appsettings.json`](backend/appsettings.json) |
| API Endpoints | [`frontend/src/api/endpoints.js`](frontend/src/api/endpoints.js) |
| Mock Server | [`frontend/src/api/mockServer.js`](frontend/src/api/mockServer.js) |
| API Client | [`frontend/src/api/client.js`](frontend/src/api/client.js) |

## 📚 Documentation

- **Frontend Optimization:** [`frontend/OPTIMIZATION.md`](frontend/OPTIMIZATION.md)
- **Backend Models:** [`backend/Models/`](backend/Models)
- **API Controllers:** [`backend/Controllers/`](backend/Controllers)
- **Database Context:** [`backend/Data/HumanitaracDbContext.cs`](backend/Data/HumanitaracDbContext.cs)

---

**Version:** 0.1.0  
**Last Updated:** February 24, 2026  
**Status:** ✅ Frontend Ready | 🔧 Backend Ready for Integration
