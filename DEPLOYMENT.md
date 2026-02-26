# 🚀 Humanitarac Deployment Guide

## Quick Summary

Your **humanitarac** project is ready to deploy. This guide shows you how to deploy to **Railway.app** (free/cheap for students).

---

## 📋 Prerequisites

You'll need:
- [ ] **GitHub account** (free) - to host your code
- [ ] **Railway.app account** (free) - for deployment
- [ ] Your project pushed to GitHub

---

## Step 1: Push to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
cd /Users/ilmaemrovic/Desktop/humanitarac-dunp
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: humanitarac-dunp with frontend and backend"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR-USERNAME/humanitarac-dunp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up (GitHub login is easiest)
3. Create a new project
4. Select "Deploy from GitHub repo"
5. Authorize GitHub and select your `humanitarac-dunp` repo

### 2.2 Add MySQL Database
In Railway dashboard:
1. Click "+ New" → "Database"
2. Select "MySQL"
3. Railway creates the database automatically ✅

### 2.3 Configure Environment Variables
Railway will auto-detect and set:
- `DATABASE_URL` (Railway provides this automatically)

You need to add manually:
1. In Railway dashboard, go to Backend service
2. Click "Variables"
3. Add:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   Jwt__Key=your-super-secret-key-change-this-to-something-random-min-32-chars
   Jwt__Issuer=humanitarac.railway.app
   Jwt__Audience=humanitarac.railway.app
   ConnectionStrings__DefaultConnection=Server=${{ RAILWAY_PRIVATE_URL }};Port=3306;Database=humanitarac_db;User=root;Password=${{ MYSQL_ROOT_PASSWORD }}
   ```

### 2.4 Deploy
Railway automatically builds and deploys when you push to GitHub. Watch the build logs in the Railway dashboard.

Your backend will be available at: `https://humanitarac-backend-production.up.railway.app` (Railway assigns a URL)

---

## Step 3: Deploy Frontend to Railway (or Vercel)

### Option A: Railway (Keep Everything in One Place)

1. Create new service in Railway project
2. Select GitHub repo again (same repo)
3. Set build command: `npm run build`
4. Set start command: Leave empty (Nginx handles it)
5. Add environment variable:
   ```
   VITE_API_BASE_URL=https://humanitarac-backend-production.up.railway.app
   ```

### Option B: Vercel (Recommended for React)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your GitHub repo
4. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-railway-backend-url.up.railway.app
   ```
5. Deploy with one click

---

## Step 4: Create Database & Run Migrations

After backend is deployed, run EF Core migrations:

```bash
cd backend

# Get your remote database connection string from Railway dashboard
# Format: Server=your-host;Port=3306;Database=humanitarac_db;User=root;Password=your-pass

# Run migrations against remote database
dotnet ef database update \
  --configuration Release \
  --connection "Server=your-railway-host;Port=3306;Database=humanitarac_db;User=root;Password=${{ MYSQL_ROOT_PASSWORD }}"
```

Or use Railway's CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set environment and run migrations
railway run dotnet ef database update
```

---

## Testing

Once deployed:

1. **Frontend:** Open your Vercel/Railway frontend URL
2. **Backend API:** Test the endpoint:
   ```bash
   curl https://your-backend-url/api/activities
   ```
3. **Check logs:** In Railway dashboard, click service → Deployments → View logs

---

## 🎯 Free Tier Details (Railway.app)

- **Includes:** 
  - $5/month free credit (runs forever with this budget)
  - Your backend + frontend + database fits in $5/month
  - Auto-scaling up to 3 replicas
  - Free SSL/HTTPS

- **When you exceed:** You pay as you go (very cheap)

---

## 📦 Local Docker Testing (Optional)

Before deploying, test with Docker locally:

```bash
cd /Users/ilmaemrovic/Desktop/humanitarac-dunp

# Build and run all services
docker-compose up --build

# Access:
# Frontend: http://localhost
# Backend API: http://localhost:5000/api/activities
# Stop: Ctrl+C then docker-compose down
```

---

## Troubleshooting

### Backend won't start
- Check Railway logs for connection string errors
- Verify `appsettings.Production.json` is correct
- Ensure database migrations ran

### Frontend can't reach backend
- Check CORS is enabled in backend
- Verify `VITE_API_BASE_URL` environment variable is set correctly
- Check Network tab in browser DevTools

### Database connection fails
- Verify connection string in Railway environment variables
- Check database user/password in MySQL service
- Run migrations manually

---

## Environment Files for Production

**backend/appsettings.Production.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=${{ RAILWAY_PRIVATE_URL }};Port=3306;Database=humanitarac_db;User=root;Password=${{ MYSQL_ROOT_PASSWORD }}"
  },
  "Jwt": {
    "Key": "change-this-to-a-very-long-random-secret",
    "Issuer": "humanitarac.railway.app",
    "Audience": "humanitarac.railway.app",
    "ExpireMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## Getting Help

- **Railway Docs:** https://docs.railway.app
- **GitHub Issues:** Add a GitHub issue to your repo
- **Check logs:** Always check service logs in Railway dashboard first

---

## Next Steps

1. [ ] Push code to GitHub
2. [ ] Create Railway account and project
3. [ ] Add MySQL database to Railway
4. [ ] Deploy backend service
5. [ ] Deploy frontend (Vercel or Railway)
6. [ ] Test the deployed app
7. [ ] Update DNS if using custom domain later

Happy deploying! 🎉
