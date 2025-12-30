# Northstar Backend

Production-grade backend service for a service marketplace platform. Built with NestJS, TypeScript, PostgreSQL, and Redis.

## Architecture

Northstar Backend follows a modular architecture with clear separation of concerns:

- **Modules**: Feature-based modules (auth, users, service-requests, etc.)
- **Guards**: Authentication and authorization guards
- **Services**: Business logic layer
- **Controllers**: HTTP request handlers
- **DTOs**: Data transfer objects for validation
- **Events**: Internal event bus for decoupled communication
- **Jobs**: Background job processing with BullMQ

### Key Components

- **Authentication**: JWT-based auth with refresh tokens
- **Authorization**: Role-based access control (RBAC) with ADMIN, BUSINESS, STAFF, CUSTOMER roles
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Redis-based job queue for async processing
- **Observability**: Structured logging, metrics, correlation IDs
- **API**: RESTful API with OpenAPI documentation

## Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Queue**: BullMQ (Redis)
- **Auth**: JWT (passport)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   # Windows (PowerShell):
   Copy-Item .env.example .env
   
   # Unix/Mac:
   cp .env.example .env
   ```

4. Start Docker services:
   ```bash
   docker-compose up -d
   ```

5. Run migrations and seed:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

Or use the Makefile:
```bash
make dev
```

The API will be available at `http://localhost:3000`

API documentation: `http://localhost:3000/api/docs`

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `API_PREFIX`: API prefix (default: v1)

## API Endpoints

### Authentication

- `POST /v1/auth/login` - Login with email and password
- `POST /v1/auth/refresh` - Refresh access token
- `GET /v1/auth/me` - Get current user profile

### Service Requests

- `POST /v1/service-requests` - Create a service request
- `GET /v1/service-requests` - List service requests (with filtering, pagination)
- `GET /v1/service-requests/:id` - Get service request by ID
- `PATCH /v1/service-requests/:id` - Update service request
- `PATCH /v1/service-requests/:id/status` - Update request status

### Provider Responses

- `POST /v1/service-requests/:id/responses` - Respond to a service request
- `GET /v1/service-requests/:id/responses` - Get responses for a request
- `GET /v1/provider-responses/my-responses` - Get my provider responses

### Admin

- `GET /v1/admin/audit-logs` - Get audit logs (ADMIN/STAFF only)

### Health & Observability

- `GET /v1/healthz` - Health check
- `GET /v1/readyz` - Readiness check
- `GET /v1/observability/metrics` - Application metrics
- `GET /v1/observability/metrics/prometheus` - Prometheus metrics

### Integrations

- `GET /v1/integrations/status` - Integration status (API key required)

## RBAC (Role-Based Access Control)

The system supports four roles:

- **ADMIN**: Full system access, can manage users, view audit logs
- **BUSINESS**: Can respond to service requests, manage business profile
- **STAFF**: Can review requests, view audit logs, manage requests
- **CUSTOMER**: Can create and manage their own service requests

## Database Schema

Key models:

- **User**: System users with roles and status
- **Business**: Business profiles for providers
- **CustomerProfile**: Customer profiles
- **ServiceRequest**: Service requests with status workflow
- **ProviderResponse**: Provider quotes and responses
- **Note**: Internal notes on requests
- **AuditLog**: Audit trail of system actions
- **ApiKey**: API keys for server-to-server integration

See `prisma/schema.prisma` for full schema definition.

## Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

Run with coverage:
```bash
npm run test:cov
```

## Development

### Database Migrations

Create a new migration:
```bash
npm run prisma:migrate
```

Apply migrations:
```bash
npm run prisma:migrate:deploy
```

### Seeding

Seed the database with demo data:
```bash
npm run prisma:seed
```

### Code Quality

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

## Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # User management
├── service-requests/  # Service request management
├── provider-responses/# Provider response handling
├── admin/             # Admin endpoints
├── jobs/              # Background job processors
├── observability/     # Metrics and monitoring
├── integrations/      # API key protected endpoints
├── common/            # Shared utilities, guards, decorators
├── prisma/            # Prisma service
└── main.ts            # Application entry point

docs/
├── CLIENT_DEMO.md     # Non-technical client demo guide
├── TECH_DEMO.md       # Technical demo with endpoints
├── API.md             # API documentation
└── ARCHITECTURE.md    # Architecture overview
```

## Background Jobs

Jobs are processed via BullMQ:

- **Email Queue**: Sends notifications (e.g., when requests are submitted/completed)
- **Cleanup Queue**: Periodic cleanup tasks (e.g., old audit logs)

Jobs are triggered by events emitted from the application.

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting (100 requests per minute)
- Input validation
- Security headers (Helmet)
- CORS configuration
- API key authentication for integrations

## Documentation

### Quick Start & Guides
- **README.md** - This file (project overview)
- **QUICKSTART.md** - Quick setup guide
- **DEMO.md** - Portfolio demo guide
- **TESTING_GUIDE.md** - Comprehensive testing documentation
- **PRODUCTION_READY_CHECKLIST.md** - Production readiness verification

### Technical Documentation
- **docs/CLIENT_DEMO.md** - Non-technical overview for clients
- **docs/TECH_DEMO.md** - Technical demo with endpoints and flows
- **docs/API.md** - Detailed API reference
- **docs/ARCHITECTURE.md** - System architecture overview
- **docs/CHANGELOG.md** - Complete changelog and fixes summary

## License

UNLICENSED

