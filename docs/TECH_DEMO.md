# Northstar Backend - Technical Demo

## Quick Start

```bash
# Start services
make dev

# Or manually:
docker-compose up -d
npm install
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

**API Base:** `http://localhost:3000/v1`  
**Swagger UI:** `http://localhost:3000/api/docs`

## Use Case 1: Service Request + Provider Response Flow

### Step 1: Customer Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@northstar.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "customer1@northstar.com",
    "role": "CUSTOMER"
  }
}
```

### Step 2: Create Service Request

```bash
TOKEN="<accessToken>"

curl -X POST http://localhost:3000/v1/service-requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-commerce Website Development",
    "description": "Need a full e-commerce platform with payment integration",
    "priority": 2,
    "metadata": {
      "budget": 15000,
      "deadline": "2024-06-01"
    }
  }'
```

**Response:**
```json
{
  "data": {
    "id": "req-uuid",
    "title": "E-commerce Website Development",
    "status": "DRAFT",
    "priority": 2,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Step 3: Submit Request

```bash
curl -X PATCH http://localhost:3000/v1/service-requests/req-uuid/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SUBMITTED"
  }'
```

**What happens:**
- Status changes to `SUBMITTED`
- Event emitted: `service-request.submitted`
- Background job queued: email notification
- Audit log entry created

### Step 4: Provider Login & Respond

```bash
# Provider login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@northstar.com",
    "password": "password123"
  }'

PROVIDER_TOKEN="<provider-accessToken>"

# Submit response
curl -X POST http://localhost:3000/v1/service-requests/req-uuid/responses \
  -H "Authorization: Bearer $PROVIDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quote": 14500,
    "message": "We can deliver within 8 weeks. Includes payment gateway integration and mobile-responsive design.",
    "estimatedDays": 56
  }'
```

**Response:**
```json
{
  "data": {
    "id": "resp-uuid",
    "serviceRequestId": "req-uuid",
    "quote": 14500,
    "estimatedDays": 56,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Step 5: List Requests with Filtering

```bash
curl "http://localhost:3000/v1/service-requests?status=SUBMITTED&sort=createdAt:desc&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Query Parameters:**
- `status`: Filter by status (DRAFT, SUBMITTED, IN_REVIEW, etc.)
- `q`: Search in title/description
- `minPriority` / `maxPriority`: Priority range (0-5)
- `startDate` / `endDate`: Date range (ISO 8601)
- `sort`: Sort field and direction (e.g., `createdAt:desc`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [
    {
      "id": "req-uuid",
      "title": "E-commerce Website Development",
      "status": "SUBMITTED",
      "responses": [...],
      "_count": {
        "responses": 1,
        "notes": 0
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

## Use Case 2: Admin Audit Log Visibility

### Step 1: Admin Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@northstar.com",
    "password": "password123"
  }'

ADMIN_TOKEN="<admin-accessToken>"
```

### Step 2: View Audit Logs

```bash
curl "http://localhost:3000/v1/admin/audit-logs?page=1&limit=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "log-uuid",
      "userId": "user-uuid",
      "action": "LOGIN",
      "resource": "AUTH",
      "metadata": {
        "email": "customer1@northstar.com"
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "user": {
        "id": "user-uuid",
        "email": "customer1@northstar.com",
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    {
      "id": "log-uuid-2",
      "userId": "user-uuid",
      "action": "CREATE",
      "resource": "SERVICE_REQUEST",
      "resourceId": "req-uuid",
      "createdAt": "2024-01-15T10:05:00Z",
      "user": {...}
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Step 3: Filter Audit Logs

```bash
# Filter by user
curl "http://localhost:3000/v1/admin/audit-logs?userId=user-uuid&page=1" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Filter by resource
curl "http://localhost:3000/v1/admin/audit-logs?resource=SERVICE_REQUEST&page=1" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Filter by action
curl "http://localhost:3000/v1/admin/audit-logs?action=LOGIN&page=1" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## API Endpoints Reference

### Authentication
- `POST /v1/auth/login` - Login (public)
- `POST /v1/auth/refresh` - Refresh token (public)
- `GET /v1/auth/me` - Get current user

### Service Requests
- `POST /v1/service-requests` - Create request
- `GET /v1/service-requests` - List with filtering
- `GET /v1/service-requests/:id` - Get by ID
- `PATCH /v1/service-requests/:id` - Update request
- `PATCH /v1/service-requests/:id/status` - Update status

### Provider Responses
- `POST /v1/service-requests/:id/responses` - Respond to request
- `GET /v1/service-requests/:id/responses` - Get responses
- `GET /v1/provider-responses/my-responses` - Get my responses

### Admin
- `GET /v1/admin/audit-logs` - Get audit logs (ADMIN/STAFF only)

### Health & Observability
- `GET /v1/healthz` - Health check (public)
- `GET /v1/readyz` - Readiness check (public)
- `GET /v1/observability/metrics` - Application metrics
- `GET /v1/observability/metrics/prometheus` - Prometheus metrics (public)

## Response Format

**Success (Single Item):**
```json
{
  "data": { ... }
}
```

**Success (Paginated):**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "error": {
    "statusCode": 400,
    "message": ["Validation error message"],
    "timestamp": "2024-01-15T10:00:00Z",
    "path": "/v1/service-requests",
    "correlationId": "uuid"
  }
}
```

## Status Workflow

Service requests follow this status progression:

```
DRAFT → SUBMITTED → IN_REVIEW → ACCEPTED → IN_PROGRESS → COMPLETED
  ↓         ↓           ↓           ↓            ↓
CANCELLED  CANCELLED  CANCELLED  CANCELLED   CANCELLED
```

**Rules:**
- Customers can submit from DRAFT
- Only ADMIN/STAFF can move to IN_REVIEW or ACCEPTED
- Once COMPLETED or CANCELLED, no further transitions

## Background Jobs

When a service request is submitted or completed:
1. Event emitted (`service-request.submitted` or `service-request.completed`)
2. Email job queued with idempotency key
3. Job processed with retry logic (3 attempts, exponential backoff)
4. Notification sent (mock implementation)

## Test Credentials

All passwords: `password123`

- **Admin**: `admin@northstar.com`
- **Business**: `business@northstar.com`
- **Customer 1**: `customer1@northstar.com`
- **Customer 2**: `customer2@northstar.com`
- **Staff**: `staff@northstar.com`

## Architecture Notes

- **Authentication:** JWT with refresh tokens
- **Authorization:** RBAC with 4 roles (ADMIN, BUSINESS, STAFF, CUSTOMER)
- **Validation:** DTOs with class-validator
- **Database:** PostgreSQL with Prisma ORM
- **Queue:** BullMQ (Redis) for background jobs
- **Logging:** Structured logging with correlation IDs
- **Metrics:** Prometheus-compatible endpoint

