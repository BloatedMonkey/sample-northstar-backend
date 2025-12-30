import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { ObservabilityService } from './observability.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('observability')
@Controller('observability')
export class ObservabilityController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Get('metrics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application metrics' })
  async getMetrics() {
    const metrics = await this.observabilityService.getMetrics();
    return { data: metrics };
  }

  @SkipThrottle()
  @Get('metrics/prometheus')
  @Public()
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  async getPrometheusMetrics() {
    const prometheus = await this.observabilityService.getPrometheusMetrics();
    return prometheus;
  }
}
