# Testing Guide

## Prerequisites

Before running tests, ensure Docker services are running:

```bash
docker compose up -d
```

This starts PostgreSQL and Redis containers required for integration and e2e tests.

## Running Tests

### Unit Tests

```bash
npm run test
```

Runs all unit tests with Jest. These tests don't require database connections.

**Expected Output:**
```
PASS src/auth/auth.service.spec.ts
PASS src/service-requests/service-requests.service.spec.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

### E2E Tests

```bash
# First, ensure database is set up
npm run prisma:migrate
npm run prisma:seed

# Then run e2e tests
npm run test:e2e
```

E2E tests require:
- Docker services running (PostgreSQL + Redis)
- Database migrations applied
- Seed data loaded

**Expected Output:**
```
PASS test/app.e2e-spec.ts
  AppController (e2e)
    Health endpoints
      ✓ /healthz (GET)
      ✓ /readyz (GET)
    Authentication
      ✓ POST /auth/login - should login successfully
      ✓ POST /auth/login - should fail with invalid credentials
      ✓ GET /auth/me - should get current user with valid token
      ✓ GET /auth/me - should fail without token
    Service Requests
      ✓ POST /service-requests - should create service request
      ✓ GET /service-requests - should list service requests
      ✓ GET /service-requests - should support filtering by status
      ✓ GET /service-requests - should support search query
      ✓ GET /service-requests - should support sorting
      ✓ GET /service-requests - should fail without authentication
      ✓ GET /service-requests/:id - should get service request by ID
      ✓ GET /service-requests/:id - should fail for unauthorized access
```

### All Tests

```bash
npm run test:all
```

Runs both unit and e2e tests sequentially.

### Test Coverage

```bash
npm run test:cov
```

Generates a coverage report showing which parts of the codebase are tested.

## Test Structure

### Unit Tests

Located in `src/**/*.spec.ts`:
- `src/auth/auth.service.spec.ts` - Authentication service tests
- `src/service-requests/service-requests.service.spec.ts` - Service requests logic tests

### E2E Tests

Located in `test/`:
- `test/app.e2e-spec.ts` - Full API integration tests

## Writing New Tests

### Unit Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### E2E Test Example

```typescript
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('YourController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Setup app
  });

  it('/your-endpoint (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/your-endpoint')
      .expect(200);
  });
});
```

## Troubleshooting

### Tests fail with "Can't reach database server"

**Solution:** Start Docker services:
```bash
docker compose up -d
```

### Tests fail with "ECONNREFUSED" for Redis

**Solution:** Ensure Redis container is running:
```bash
docker compose ps
docker compose up -d redis
```

### E2E tests fail with validation errors

**Solution:** Environment variables are set automatically in test files. If issues persist, check that `.env` file exists with required variables.

### Prisma client not found

**Solution:** Generate Prisma client:
```bash
npx prisma generate
```

## CI/CD Integration

For CI/CD pipelines, use:

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Run migrations (if needed)
npm run prisma:migrate

# Run tests
npm run test:all
```

Ensure your CI environment has Docker available for e2e tests, or mock external services for faster execution.

