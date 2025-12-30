import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Redis } from 'ioredis';

@Injectable()
export class AppService implements OnModuleDestroy {
  private redis: Redis;

  constructor(private prisma: PrismaService) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      retryStrategy: () => null,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  healthz() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  async readyz() {
    const checks = {
      database: false,
      redis: false,
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch {
      // Database check failed
    }

    try {
      await this.redis.ping();
      checks.redis = true;
    } catch {
      // Redis check failed
    }

    const isReady = checks.database && checks.redis;

    return {
      status: isReady ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
