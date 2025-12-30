import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProviderResponsesService } from './provider-responses.service';
import { CreateProviderResponseDto } from './dto/create-provider-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { UserRole } from '@prisma/client';

@ApiTags('provider-responses')
@Controller('service-requests/:serviceRequestId/responses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProviderResponsesController {
  constructor(private readonly providerResponsesService: ProviderResponsesService) {}

  @Post()
  @Roles(UserRole.BUSINESS, UserRole.STAFF)
  @ApiOperation({ summary: 'Respond to a service request' })
  async create(
    @Param('serviceRequestId') serviceRequestId: string,
    @Body() createDto: CreateProviderResponseDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const response = await this.providerResponsesService.create(
      serviceRequestId,
      req.user.id,
      createDto,
    );
    return { data: response };
  }

  @Get()
  @ApiOperation({ summary: 'Get all responses for a service request' })
  async findByServiceRequest(@Param('serviceRequestId') serviceRequestId: string) {
    const responses = await this.providerResponsesService.findByServiceRequest(serviceRequestId);
    return { data: responses };
  }
}

@ApiTags('provider-responses')
@Controller('provider-responses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProviderResponsesListController {
  constructor(private readonly providerResponsesService: ProviderResponsesService) {}

  @Get('my-responses')
  @Roles(UserRole.BUSINESS, UserRole.STAFF)
  @ApiOperation({ summary: 'Get my provider responses' })
  async findMyResponses(
    @Query() paginationDto: PaginationDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;
    const { data, total } = await this.providerResponsesService.findByProvider(
      req.user.id,
      skip,
      limit,
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
