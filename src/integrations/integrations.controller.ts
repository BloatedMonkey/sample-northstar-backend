import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('integrations')
@Controller('integrations')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
export class IntegrationsController {
  @Get('status')
  @ApiOperation({ summary: 'Get integration status' })
  getStatus() {
    return {
      data: {
        status: 'active',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
