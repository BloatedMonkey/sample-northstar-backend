# 🔧 Install Required Dependencies

**Your application is ready, but you need PostgreSQL and Redis to run it.**

---

## 🎯 Quick Install Options

### Option 1: Use Docker Desktop (Easiest)

1. **Install Docker Desktop for Windows**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and restart your computer
   - Open Docker Desktop and let it start

2. **Start Services**
   ```powershell
   docker-compose up -d postgres redis
   ```

3. **Done!** Your database and cache are running.

---

### Option 2: Install Locally (Alternative)

#### PostgreSQL 16

**Using winget (Recommended):**
```powershell
winget install PostgreSQL.PostgreSQL.16
```

**Or download installer:**
- Go to: https://www.postgresql.org/download/windows/
- Download PostgreSQL 16
- Install with default settings
- Remember the password you set!

**After Installation:**
```powershell
# Create database
psql -U postgres
CREATE DATABASE northstar;
\q
```

#### Redis

**Option A: Use WSL (Recommended)**
```powershell
# Install WSL if you don't have it
wsl --install

# After restart, in WSL terminal:
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

**Option B: Windows Redis**
- Download: https://github.com/microsoftarchive/redis/releases
- Extract and run: `redis-server.exe`

---

## ✅ Verify Installation

### Check PostgreSQL
```powershell
psql --version
# Should show: psql (PostgreSQL) 16.x
```

### Check Redis (if using WSL)
```powershell
wsl redis-cli ping
# Should return: PONG
```

---

## 🔧 Update Connection Settings

If you installed locally, update your `.env` file:

```env
# PostgreSQL (update with your password)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/northstar?schema=public"

# Redis (default is usually fine)
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

---

## 🚀 Next Steps

Once PostgreSQL and Redis are installed:

```powershell
# 1. Run database migrations
npm run prisma:migrate

# 2. Seed database
npm run prisma:seed

# 3. Start backend
npm run start:dev
```

Then in a new terminal:
```powershell
# 4. Start frontend
cd client
npm run dev
```

---

## 🎯 Simplest Path

**If you want the absolute easiest setup:**

1. Install Docker Desktop (one-time, 5 minutes)
2. Run `docker-compose up -d`
3. Run `npm run prisma:migrate`
4. Run `npm run start:dev`

**That's it!** Everything will work.

---

## 💡 Don't Want to Install Anything?

You can also use cloud databases (free tiers):

- **Supabase** - Free PostgreSQL: https://supabase.com
- **Upstash** - Free Redis: https://upstash.com

Just update the `.env` with their connection URLs!

---

## 🆘 Need Help?

Run into issues? Check:
- `QUICK_START.md` - Step-by-step startup guide
- `README.md` - Full documentation
- `TROUBLESHOOTING.md` - Common problems

---

**Choose the option that works best for you and let's get this running!** 🚀
