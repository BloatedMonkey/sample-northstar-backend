# 🚀 Quick Start Guide

**Your environment files are ready!** Here's how to get started:

---

## ✅ Step 1: Database Setup (Choose One)

### Option A: Docker (Recommended if you have Docker installed)
```powershell
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait 10 seconds for services to start
Start-Sleep -Seconds 10
```

### Option B: Use Existing PostgreSQL/Redis
If you already have PostgreSQL and Redis running:

1. **Update `.env`** with your database connection:
   ```
   DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/northstar?schema=public"
   REDIS_HOST="localhost"
   REDIS_PORT="6379"
   ```

2. **Create the database:**
   ```sql
   -- Connect to PostgreSQL and run:
   CREATE DATABASE northstar;
   ```

### Option C: Install PostgreSQL/Redis
If you don't have them installed:

**PostgreSQL:**
- Download: https://www.postgresql.org/download/windows/
- Or use: `winget install PostgreSQL.PostgreSQL`

**Redis:**
- Download: https://github.com/microsoftarchive/redis/releases
- Or use WSL: `wsl sudo apt install redis-server`

---

## ✅ Step 2: Database Migrations

```powershell
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

---

## ✅ Step 3: Start the Application

### Terminal 1: Backend
```powershell
npm run start:dev
```

Wait for: `[Nest] Application successfully started`

### Terminal 2: Frontend
```powershell
cd client
npm run dev
```

Wait for: `ready - started server on 0.0.0.0:3001`

---

## 🌐 Access the Application

Once both are running:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

---

## 🎯 Quick Test

### 1. Check Backend Health
```powershell
curl http://localhost:3000/health
```

### 2. Visit Frontend
Open your browser: http://localhost:3001

### 3. Try to Login
The seed script creates a demo user:
- **Email**: `admin@example.com`
- **Password**: `Admin123!`

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:** Make sure PostgreSQL is running and DATABASE_URL in `.env` is correct

### Issue: "Redis connection failed"
**Solution:** Make sure Redis is running on port 6379

### Issue: "Port 3000 already in use"
**Solution:** Stop the process using port 3000 or change PORT in `.env`

### Issue: "Port 3001 already in use"  
**Solution:** Stop the process or run: `cd client && npm run dev -- -p 3002`

### Issue: Module not found errors
**Solution:** 
```powershell
# Backend
npm install

# Frontend
cd client
npm install
```

---

## 🎨 What to Try

1. **Register a new account** at http://localhost:3001
2. **Login with demo credentials**
3. **Check the dashboard** - See stats and recent activity
4. **Open API docs** at http://localhost:3000/api
5. **Try API endpoints** in Swagger UI

---

## 📊 Prisma Studio (Database GUI)

Want to see your database?

```powershell
npm run prisma:studio
```

Opens at: http://localhost:5555

---

## 🛑 Stopping the Application

### Stop Backend
Press `Ctrl + C` in the backend terminal

### Stop Frontend
Press `Ctrl + C` in the frontend terminal

### Stop Docker Services (if using Docker)
```powershell
docker-compose down
```

---

## 📚 Next Steps

1. ✅ **Test the application** - Make sure everything works
2. 📸 **Take screenshots** - For your portfolio
3. 🚀 **Deploy it** - See `docs/DEPLOYMENT_PLATFORMS.md`
4. 📋 **Complete manual steps** - See `MANUAL_STEPS.md`

---

## 🆘 Still Having Issues?

Check these files:
- `README.md` - Full documentation
- `docs/FULLSTACK_GUIDE.md` - Comprehensive guide
- `MANUAL_STEPS.md` - Setup checklist
- `TROUBLESHOOTING.md` - Common issues

Or check the logs:
- Backend logs are in the terminal
- Frontend logs are in the browser console (F12)

---

**Built with ❤️ by Arman Hazrati**
