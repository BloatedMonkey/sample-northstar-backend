// Set test environment variables BEFORE importing modules
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://northstar:northstar_dev@localhost:5432/northstar_test?schema=public';
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-e2e-tests';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key-for-e2e-tests';
process.env.API_PREFIX = process.env.API_PREFIX || 'v1';
process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = 'test';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health endpoints', () => {
    it('/healthz (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/healthz')
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('/readyz (GET)', () => {
      return request(app.getHttpServer())
        .get('/v1/readyz')
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('checks');
        });
    });
  });

  describe('Authentication', () => {
    it('POST /auth/login - should login successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'customer1@northstar.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      accessToken = response.body.accessToken;
    });

    it('POST /auth/login - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'customer1@northstar.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('GET /auth/me - should get current user with valid token', async () => {
      if (!accessToken) {
        const loginResponse = await request(app.getHttpServer()).post('/v1/auth/login').send({
          email: 'customer1@northstar.com',
          password: 'password123',
        });
        accessToken = loginResponse.body.accessToken;
      }

      return request(app.getHttpServer())
        .get('/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data).toHaveProperty('email');
        });
    });

    it('GET /auth/me - should fail without token', () => {
      return request(app.getHttpServer()).get('/v1/auth/me').expect(401);
    });
  });

  describe('Service Requests', () => {
    let customerToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/v1/auth/login').send({
        email: 'customer1@northstar.com',
        password: 'password123',
      });
      customerToken = response.body.accessToken;
    });

    it('POST /service-requests - should create service request', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/service-requests')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          title: 'Test Request',
          description: 'Test Description',
          priority: 1,
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Request');
    });

    it('GET /service-requests - should list service requests', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/service-requests')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect((response.body as any).meta).toHaveProperty('page');
      expect((response.body as any).meta).toHaveProperty('limit');
      expect((response.body as any).meta).toHaveProperty('total');
      expect((response.body as any).meta).toHaveProperty('totalPages');
    });

    it('GET /service-requests - should support filtering by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/service-requests?status=DRAFT')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
    });

    it('GET /service-requests - should support search query', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/service-requests?q=test')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
    });

    it('GET /service-requests - should support sorting', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/service-requests?sort=createdAt:desc')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
    });

    it('GET /service-requests - should fail without authentication', () => {
      return request(app.getHttpServer()).get('/v1/service-requests').expect(401);
    });

    it('GET /service-requests/:id - should get service request by ID', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/v1/service-requests')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          title: 'Test Request for Get',
          description: 'Test Description',
          priority: 1,
        })
        .expect(201);

      const requestId = createResponse.body.data.id;

      const response = await request(app.getHttpServer())
        .get(`/v1/service-requests/${requestId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id', requestId);
      expect(response.body.data).toHaveProperty('title');
    });

    it('GET /service-requests/:id - should fail for unauthorized access', async () => {
      const businessResponse = await request(app.getHttpServer()).post('/v1/auth/login').send({
        email: 'business@northstar.com',
        password: 'password123',
      });
      const businessToken = businessResponse.body.accessToken;

      const createResponse = await request(app.getHttpServer())
        .post('/v1/service-requests')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          title: 'Private Request',
          description: 'Should not be accessible',
          priority: 1,
        })
        .expect(201);

      const requestId = createResponse.body.data.id;

      await request(app.getHttpServer())
        .get(`/v1/service-requests/${requestId}`)
        .set('Authorization', `Bearer ${businessToken}`)
        .expect(403);
    });
  });
});
