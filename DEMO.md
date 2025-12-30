# Northstar Backend - Portfolio Demo Guide

A concise guide to demonstrate the backend to clients (OrangeMacro) in 2 minutes.

> **For detailed use cases:** See `docs/CLIENT_DEMO.md` (non-technical) or `docs/TECH_DEMO.md` (technical)

## Quick Start

```bash
# Start Docker services
docker compose up -d

# Install dependencies (if not done)
npm install

# Set up database
npm run prisma:migrate
npm run prisma:seed

# Start development server
npm run start:dev
```

> **Note:** On Windows, use the commands above. The `make dev` command is only available on Unix-like systems.

**Server**: http://localhost:3000  
**API Docs**: http://localhost:3000/api/docs  
**Health Check**: http://localhost:3000/v1/healthz

## Test Users

All passwords: `password123`

- **Admin**: `admin@northstar.com`
- **Business**: `business@northstar.com`
- **Customer**: `customer1@northstar.com`
- **Staff**: `staff@northstar.com`

## 2-Minute Demo Flow

**Setup**: Ensure services are running (`make dev` or `docker-compose up -d && npm run start:dev`)

### 1. Show API Documentation (15s)

Open Swagger UI: http://localhost:3000/api/docs

**Highlight**:
- Complete API documentation
- Try-it-out functionality
- Authentication flows
- Request/response schemas

### 2. Login as Customer (20s)

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@northstar.com",
    "password": "password123"
  }'
```

**Show**: 
- JWT tokens returned (access + refresh)
- User info in response
- Token used in subsequent requests

### 3. Create Service Request (25s)

```bash
# Save the accessToken from login response
TOKEN="your-access-token-here"

curl -X POST http://localhost:3000/v1/service-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Website Redesign",
    "description": "Need a modern, responsive website",
    "priority": 2,
    "metadata": {
      "budget": 10000,
      "deadline": "2024-04-01"
    }
  }'
```

**Show**: 
- Request created with ID
- Status workflow (DRAFT → SUBMITTED)
- Audit logging (mention admin endpoint)

### 4. List & Filter Requests (30s)

```bash
# List all requests
curl -X GET "http://localhost:3000/v1/service-requests?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl -X GET "http://localhost:3000/v1/service-requests?status=SUBMITTED&page=1" \
  -H "Authorization: Bearer $TOKEN"

# Search
curl -X GET "http://localhost:3000/v1/service-requests?q=website&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

**Show**: 
- Pagination (page, limit, total, totalPages)
- Filtering (status, priority range, date range)
- Search (title/description)
- Sorting (field:direction format)
- Consistent `{ data, meta }` response format

### 5. Provider Response & Background Jobs (20s)

```bash
# Login as business
BUSINESS_TOKEN="business-token-here"

# Respond to request
curl -X POST http://localhost:3000/v1/service-requests/{requestId}/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BUSINESS_TOKEN" \
  -d '{
    "quote": 8500,
    "message": "We can deliver within 6 weeks",
    "estimatedDays": 42
  }'
```

**Show**: 
- Provider can respond with quote
- Background job triggered (email notification)
- Event-driven architecture
- Idempotency handling

## Key Features to Highlight (Quick Talking Points)

1. **Security** (30s)
   - JWT authentication with refresh tokens
   - Role-based access control (RBAC) - 4 roles
   - Rate limiting (100 req/min, excludes health)
   - Password policy (8+ chars, complexity)
   - Input validation on all endpoints

2. **API Quality** (30s)
   - RESTful design with versioning (`/v1`)
   - Consistent response format (`{ data, meta }`)
   - Comprehensive filtering (status, priority, date, search)
   - Sorting with validation
   - OpenAPI/Swagger documentation

3. **Observability** (20s)
   - Health checks (`/healthz`, `/readyz`) - checks DB + Redis
   - Prometheus metrics endpoint
   - Correlation IDs for request tracking
   - Structured logging (Pino)

4. **Background Jobs** (20s)
   - BullMQ job queue (Redis)
   - Email notifications (event-driven)
   - Retry logic with exponential backoff
   - Idempotency handling

5. **Developer Experience** (20s)
   - Docker Compose setup
   - One-command startup (`make dev`)
   - Seed data for demo
   - Comprehensive tests (unit + e2e)

## API Documentation

Interactive Swagger UI: http://localhost:3000/api/docs

## Health Checks

```bash
# Basic health
curl http://localhost:3000/v1/healthz

# Readiness (checks DB + Redis)
curl http://localhost:3000/v1/readyz
```

## Metrics

```bash
# Prometheus metrics
curl http://localhost:3000/v1/observability/metrics/prometheus
```

## What Makes This Production-Ready

- ✅ Security best practices (JWT, RBAC, rate limiting)
- ✅ Comprehensive error handling
- ✅ Observability (logging, metrics, health checks)
- ✅ Background job processing
- ✅ Database migrations
- ✅ Testing (unit + e2e)
- ✅ API documentation
- ✅ Docker setup
- ✅ Environment configuration

