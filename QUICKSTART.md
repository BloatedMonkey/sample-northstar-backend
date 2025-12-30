# Quick Start Guide

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment file:**
   ```bash
   # Windows (PowerShell):
   Copy-Item .env.example .env
   
   # Unix/Mac:
   cp .env.example .env
   ```

3. **Start Docker services:**
   ```bash
   docker-compose up -d
   ```

4. **Set up environment:**
   Edit `.env` file if needed (defaults work for local dev):
   ```env
   DATABASE_URL=postgresql://northstar:northstar_dev@localhost:5432/northstar?schema=public
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   JWT_REFRESH_EXPIRES_IN=7d
   NODE_ENV=development
   PORT=3000
   API_PREFIX=v1
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=debug
   ```

4. **Run migrations and seed:**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Start the server:**
   ```bash
   npm run start:dev
   ```

## Example API Calls

### 1. Login as Customer

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@northstar.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response.

### 2. Create a Service Request

```bash
curl -X POST http://localhost:3000/v1/service-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-access-token>" \
  -d '{
    "title": "Website Redesign",
    "description": "Need a complete website redesign with modern UI",
    "priority": 2,
    "metadata": {
      "budget": 8000,
      "deadline": "2024-04-01"
    }
  }'
```

### 3. List Service Requests

```bash
curl -X GET "http://localhost:3000/v1/service-requests?page=1&limit=10&status=SUBMITTED" \
  -H "Authorization: Bearer <your-access-token>"
```

## Test Credentials

After seeding, you can use these accounts:

- **Admin**: `admin@northstar.com` / `password123`
- **Business**: `business@northstar.com` / `password123`
- **Customer 1**: `customer1@northstar.com` / `password123`
- **Customer 2**: `customer2@northstar.com` / `password123`
- **Staff**: `staff@northstar.com` / `password123`

## Generate API Key

```bash
npm run generate:api-key "My Integration" "Description"
```

## View API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:3000/api/docs

## Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# With coverage
npm run test:cov
```

