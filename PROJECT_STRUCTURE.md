# Project Structure

## Overview

This document describes the organization of the Northstar Backend project.

## Root Directory

```
northstar-backend/
├── README.md                    # Main project documentation
├── QUICKSTART.md                # Quick setup guide
├── DEMO.md                      # Portfolio demo guide
├── TESTING_GUIDE.md             # Testing documentation
├── PRODUCTION_READY_CHECKLIST.md # Production readiness checklist
├── PROJECT_STRUCTURE.md         # This file
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── nest-cli.json                # NestJS CLI configuration
├── docker-compose.yml           # Docker services configuration
├── Makefile                     # Development shortcuts
├── .gitignore                   # Git ignore rules
│
├── src/                         # Source code
│   ├── main.ts                  # Application entry point
│   ├── app.module.ts            # Root module
│   ├── app.controller.ts        # Root controller
│   ├── app.service.ts           # Root service
│   │
│   ├── auth/                    # Authentication module
│   ├── users/                   # User management
│   ├── service-requests/        # Service requests (core feature)
│   ├── provider-responses/      # Provider responses
│   ├── admin/                   # Admin endpoints
│   ├── jobs/                    # Background job processors
│   ├── observability/           # Metrics and monitoring
│   ├── integrations/            # API key protected routes
│   ├── common/                  # Shared utilities
│   └── prisma/                  # Database service
│
├── prisma/                      # Database
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed script
│
├── test/                        # E2E tests
│   ├── app.e2e-spec.ts          # E2E test suite
│   └── jest-e2e.json            # E2E Jest configuration
│
├── scripts/                     # Utility scripts
│   └── generate-api-key.ts     # API key generation
│
└── docs/                        # Documentation
    ├── README.md                # Documentation index
    ├── CHANGELOG.md             # Project changelog
    ├── CLIENT_DEMO.md           # Non-technical demo guide
    ├── TECH_DEMO.md             # Technical demo guide
    ├── API.md                   # API reference
    └── ARCHITECTURE.md          # Architecture overview
```

## Source Code Structure (`src/`)

### Feature Modules

Each feature module follows NestJS conventions:

```
module-name/
├── module-name.controller.ts    # HTTP request handlers
├── module-name.service.ts       # Business logic
├── module-name.module.ts        # Module definition
├── dto/                         # Data transfer objects
│   └── *.dto.ts
└── *.spec.ts                    # Unit tests (if any)
```

### Common Module (`src/common/`)

Shared utilities used across modules:

- **config/** - Configuration validation
- **constants/** - Application constants
- **decorators/** - Custom decorators (`@Public`, `@Roles`)
- **dto/** - Shared DTOs (pagination, validation)
- **filters/** - Exception filters
- **guards/** - Authentication/authorization guards
- **interfaces/** - TypeScript interfaces
- **logger/** - Logging service
- **middleware/** - Request middleware

## Documentation Structure

### Root Documentation
- **README.md** - Main project overview and getting started
- **QUICKSTART.md** - Quick setup instructions
- **DEMO.md** - Portfolio demo walkthrough
- **TESTING_GUIDE.md** - Comprehensive testing documentation
- **PRODUCTION_READY_CHECKLIST.md** - Production readiness verification

### Technical Documentation (`docs/`)
- **README.md** - Documentation index
- **CHANGELOG.md** - Complete changelog and fixes
- **CLIENT_DEMO.md** - Non-technical client presentation
- **TECH_DEMO.md** - Technical demo with API examples
- **API.md** - Complete API reference
- **ARCHITECTURE.md** - System architecture details

## Configuration Files

- **package.json** - Dependencies and npm scripts
- **tsconfig.json** - TypeScript compiler options
- **nest-cli.json** - NestJS CLI configuration
- **docker-compose.yml** - Docker services (PostgreSQL, Redis)
- **.gitignore** - Git ignore patterns
- **Makefile** - Development shortcuts (Linux/macOS)

## Key Directories

### `src/` - Source Code
All application code lives here, organized by feature modules.

### `prisma/` - Database
- Schema definition
- Seed script for demo data

### `test/` - E2E Tests
End-to-end integration tests using Supertest.

### `scripts/` - Utility Scripts
Helper scripts for development and maintenance.

### `docs/` - Documentation
All technical and user-facing documentation.

## File Naming Conventions

- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **Modules**: `*.module.ts`
- **DTOs**: `*.dto.ts`
- **Tests**: `*.spec.ts` (unit) or `*.e2e-spec.ts` (e2e)
- **Guards**: `*.guard.ts`
- **Interfaces**: `*.interface.ts`

## Best Practices

1. **Feature-based modules** - Each feature is self-contained
2. **Shared code in common/** - Reusable utilities
3. **DTOs for validation** - All inputs validated
4. **Consistent naming** - Follow NestJS conventions
5. **Documentation in docs/** - Organized technical docs
6. **Tests alongside code** - Unit tests in same directory

## Adding New Features

1. Create module directory: `src/feature-name/`
2. Add controller, service, module files
3. Create DTOs in `dto/` subdirectory
4. Add to appropriate parent module
5. Update documentation if needed

