# Architecture Overview

## System Architecture

Northstar Backend follows a layered, modular architecture:

```
┌─────────────────────────────────────────┐
│           HTTP Layer (Controllers)      │
│  - Request validation                   │
│  - Response formatting                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Business Logic (Services)       │
│  - Domain logic                         │
│  - Event emission                      │
│  - Audit logging                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Access (Prisma)            │
│  - Database queries                    │
│  - Transactions                        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            PostgreSQL                   │
└─────────────────────────────────────────┘
```

## Request Lifecycle

1. **Request arrives** → Correlation ID middleware adds tracking ID
2. **Authentication** → JWT guard validates token
3. **Authorization** → Roles guard checks permissions
4. **Validation** → DTO validation via class-validator
5. **Business Logic** → Service processes request
6. **Database** → Prisma executes queries
7. **Events** → Domain events emitted (if applicable)
8. **Response** → Formatted response returned
9. **Audit** → Action logged (if applicable)

## Event-Driven Architecture

The system uses an internal event bus for decoupled communication:

```
Service Request Submitted
    ↓
Event Emitted: 'service-request.submitted'
    ↓
Jobs Listener
    ↓
Email Job Queued
    ↓
Email Processor
    ↓
Email Sent (mock)
```

## Background Jobs

Jobs are processed asynchronously using BullMQ:

- **Email Queue**: Notification emails
- **Cleanup Queue**: Maintenance tasks

Jobs are triggered by:
- Domain events (e.g., request submitted)
- Scheduled tasks (e.g., nightly cleanup)

## Security Layers

1. **Helmet**: Security headers
2. **CORS**: Cross-origin resource sharing
3. **Rate Limiting**: Throttle requests
4. **JWT Auth**: Token-based authentication
5. **RBAC**: Role-based authorization
6. **Input Validation**: DTO validation
7. **API Keys**: Server-to-server auth

## Database Design

### Key Relationships

- User → Business (1:1, optional)
- User → CustomerProfile (1:1, optional)
- CustomerProfile → ServiceRequest (1:N)
- ServiceRequest → ProviderResponse (1:N)
- ServiceRequest → Note (1:N)
- User → AuditLog (1:N)

### Indexes

Indexes are defined on:
- User email, role+status
- ServiceRequest customerId, status, createdAt
- AuditLog userId, resource+resourceId, createdAt

## Observability

### Logging

- Structured logging with Pino
- Correlation IDs for request tracking
- Log levels: debug, info, warn, error

### Metrics

- Application metrics endpoint
- Prometheus-compatible metrics
- Tracks: users, requests, responses

### Health Checks

- `/healthz`: Basic health check
- `/readyz`: Readiness check (includes DB connectivity)

## Error Handling

Global exception filter:
- Catches all exceptions
- Formats error responses consistently
- Includes correlation ID
- Logs errors appropriately

## Testing Strategy

- **Unit Tests**: Service logic, isolated
- **Integration Tests**: API endpoints with test DB
- **E2E Tests**: Full request/response cycle

Test database is isolated and cleaned between runs.

