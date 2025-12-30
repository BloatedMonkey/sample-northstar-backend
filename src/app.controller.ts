import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SkipThrottle()
  @Get('healthz')
  @Public()
  @ApiOperation({ summary: 'Health check endpoint' })
  healthz() {
    return this.appService.healthz();
  }

  @SkipThrottle()
  @Get('readyz')
  @Public()
  @ApiOperation({ summary: 'Readiness check endpoint' })
  readyz() {
    return this.appService.readyz();
  }
}
