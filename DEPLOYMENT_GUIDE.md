# Deployment Guide - Northstar Backend

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] All tests passing (10/10 unit tests)
- [x] Code compiles without errors
- [x] No critical linting errors
- [x] Type safety verified
- [x] No security vulnerabilities in code

### ✅ Configuration
- [x] Environment variables documented
- [x] Docker Compose configured
- [x] Database migrations ready
- [x] Seed script available

## Production Deployment Steps

### 1. Environment Setup

Create `.env` file with production values:

```env
NODE_ENV=production
PORT=3000
API_PREFIX=v1

# Database
DATABASE_URL=postgresql://user:password@host:5432/northstar?schema=public

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379

# JWT Secrets (USE STRONG SECRETS IN PRODUCTION)
JWT_SECRET=your-very-strong-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-very-strong-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Logging
LOG_LEVEL=info
```

### 2. Database Setup

```bash
# Run migrations
npm run prisma:migrate:deploy

# Optional: Seed initial data
npm run prisma:seed
```

### 3. Build Application

```bash
# Install dependencies
npm ci

# Generate Prisma client
npm run prisma:generate

# Build application
npm run build
```

### 4. Start Services

**Option A: Docker Compose (Development/Staging)**
```bash
docker compose up -d
```

**Option B: Production Infrastructure**
- Set up PostgreSQL 16 instance
- Set up Redis 7 instance
- Configure connection strings

### 5. Start Application

```bash
# Production mode
npm run start:prod

# Or with PM2
pm2 start dist/main.js --name northstar-backend
```

### 6. Verify Deployment

```bash
# Health check
curl https://your-domain.com/v1/healthz

# Readiness check
curl https://your-domain.com/v1/readyz

# API docs
# Visit: https://your-domain.com/api/docs
```

## Production Considerations

### Security
- ✅ Use strong JWT secrets (min 32 characters)
- ✅ Enable HTTPS/TLS
- ✅ Configure CORS for specific origins
- ✅ Set up rate limiting per user if needed
- ✅ Enable security headers (Helmet)
- ✅ Regular security audits

### Monitoring
- ✅ Set up application monitoring (e.g., Datadog, New Relic)
- ✅ Configure Prometheus metrics scraping
- ✅ Set up log aggregation
- ✅ Configure alerting for errors
- ✅ Monitor database performance

### Scaling
- ✅ Use connection pooling for database
- ✅ Configure Redis clustering if needed
- ✅ Set up load balancer
- ✅ Configure horizontal scaling
- ✅ Use CDN for static assets (if any)

### Backup & Recovery
- ✅ Set up automated database backups
- ✅ Test backup restoration
- ✅ Document recovery procedures
- ✅ Set up disaster recovery plan

## Health Monitoring

### Endpoints
- `GET /v1/healthz` - Basic health check
- `GET /v1/readyz` - Readiness (checks DB + Redis)
- `GET /v1/observability/metrics/prometheus` - Metrics

### Monitoring Queries

```bash
# Check application health
curl https://your-domain.com/v1/healthz

# Check database connectivity
curl https://your-domain.com/v1/readyz

# Get metrics
curl https://your-domain.com/v1/observability/metrics/prometheus
```

## Troubleshooting

### Application won't start
1. Check environment variables are set
2. Verify database connection
3. Verify Redis connection
4. Check logs for errors

### Database connection issues
1. Verify DATABASE_URL is correct
2. Check database is accessible
3. Verify network/firewall rules
4. Check database credentials

### Redis connection issues
1. Verify REDIS_HOST and REDIS_PORT
2. Check Redis is running
3. Verify network connectivity
4. Check Redis authentication (if configured)

## Rollback Procedure

If deployment fails:

1. **Stop new version:**
   ```bash
   pm2 stop northstar-backend
   ```

2. **Restore previous version:**
   ```bash
   git checkout previous-version-tag
   npm ci
   npm run build
   pm2 restart northstar-backend
   ```

3. **Verify rollback:**
   ```bash
   curl https://your-domain.com/v1/healthz
   ```

## Post-Deployment

1. ✅ Verify all endpoints working
2. ✅ Check logs for errors
3. ✅ Monitor metrics
4. ✅ Test critical user flows
5. ✅ Verify background jobs processing

## Support

For issues or questions:
- Check logs: Application logs should be in configured log directory
- Check metrics: Prometheus endpoint for system health
- Review documentation: See `docs/` folder for detailed guides

