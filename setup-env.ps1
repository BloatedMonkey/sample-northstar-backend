# Quick Environment Setup Script
# Author: Arman Hazrati

Write-Host "🚀 Setting up Northstar environment files..." -ForegroundColor Cyan

# Create backend .env
$backendEnv = @"
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/northstar?schema=public"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-please-use-strong-secret"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production-use-different-secret"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
REDIS_DB="0"

# Server
NODE_ENV="development"
PORT="3000"
API_PREFIX="api"

# CORS
CORS_ORIGIN="http://localhost:3001,http://localhost:3000"

# Logging
LOG_LEVEL="debug"

# Rate Limiting
THROTTLE_TTL="60000"
THROTTLE_LIMIT="100"
"@

# Create frontend .env.local
$frontendEnv = @"
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# Application
NEXT_PUBLIC_APP_NAME=Northstar
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
"@

# Write backend .env
Set-Content -Path ".env" -Value $backendEnv
Write-Host "✅ Created .env (backend)" -ForegroundColor Green

# Write frontend .env.local
Set-Content -Path "client\.env.local" -Value $frontendEnv
Write-Host "✅ Created client/.env.local (frontend)" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Environment files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start PostgreSQL and Redis: docker-compose up -d postgres redis" -ForegroundColor White
Write-Host "2. Run migrations: npm run prisma:migrate" -ForegroundColor White
Write-Host "3. Start backend: npm run start:dev" -ForegroundColor White
Write-Host "4. Start frontend: cd client && npm run dev" -ForegroundColor White
Write-Host ""
