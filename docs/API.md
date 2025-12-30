# API Documentation

## Base URL

All API requests should be made to: `http://localhost:3000/v1`

## Authentication

Most endpoints require authentication via JWT Bearer token.

### Login

```bash
POST /v1/auth/login
Content-Type: application/json

{
  "email": "customer1@northstar.com",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "customer1@northstar.com",
    "role": "CUSTOMER",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Using the Token

Include the token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

## Service Requests

### Create Service Request

```bash
POST /v1/service-requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Website Development",
  "description": "Need a new company website",
  "priority": 2,
  "metadata": {
    "budget": 5000,
    "deadline": "2024-03-01"
  }
}
```

### List Service Requests

```bash
GET /v1/service-requests?page=1&limit=20&status=SUBMITTED&q=website&sort=createdAt:desc
Authorization: Bearer <token>
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status (DRAFT, SUBMITTED, IN_REVIEW, etc.)
- `q`: Search query (searches title and description)
- `sort`: Sort field and direction (e.g., `createdAt:desc`)

### Update Service Request Status

```bash
PATCH /v1/service-requests/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "SUBMITTED"
}
```

Status transitions:
- DRAFT → SUBMITTED, CANCELLED
- SUBMITTED → IN_REVIEW, CANCELLED
- IN_REVIEW → ACCEPTED, CANCELLED
- ACCEPTED → IN_PROGRESS, CANCELLED
- IN_PROGRESS → COMPLETED, CANCELLED

## Provider Responses

### Respond to Service Request

```bash
POST /v1/service-requests/:id/responses
Authorization: Bearer <token>
Content-Type: application/json

{
  "quote": 4500,
  "message": "We can deliver this within 6 weeks",
  "estimatedDays": 42
}
```

## Response Format

All successful responses follow this format:

```json
{
  "data": { ... },
  "meta": { ... }  // For paginated responses
}
```

Error responses:

```json
{
  "error": {
    "statusCode": 400,
    "message": "Validation failed",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/v1/service-requests",
    "correlationId": "uuid"
  }
}
```

## Pagination

Paginated responses include metadata:

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

## API Key Authentication

For integration endpoints, use API key authentication:

```bash
GET /v1/integrations/status
X-API-Key: <api-key>
```

