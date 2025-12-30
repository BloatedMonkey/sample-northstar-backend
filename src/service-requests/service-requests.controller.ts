import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { ListServiceRequestsDto } from './dto/list-service-requests.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('service-requests')
@Controller('service-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service request' })
  async create(@Request() req: AuthenticatedRequest, @Body() createDto: CreateServiceRequestDto) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const request = await this.serviceRequestsService.create(customer.id, createDto);
    return { data: request };
  }

  @Get()
  @ApiOperation({ summary: 'List service requests with filtering and pagination' })
  async findAll(
    @Query() query: ListServiceRequestsDto,
    @Request() req?: AuthenticatedRequest,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const customer =
      req?.user?.role === 'CUSTOMER'
        ? await this.prisma.customerProfile.findUnique({
            where: { userId: req.user.id },
          })
        : null;

    const { data, total } = await this.serviceRequestsService.findAll({
      status: query.status,
      customerId: customer?.id,
      q: query.q,
      minPriority: query.minPriority,
      maxPriority: query.maxPriority,
      startDate: query.startDate,
      endDate: query.endDate,
      sort: query.sort,
      skip,
      take: limit,
    });

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

  @Get(':id')
  @ApiOperation({ summary: 'Get service request by ID' })
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const customer =
      req.user.role === 'CUSTOMER'
        ? await this.prisma.customerProfile.findUnique({
            where: { userId: req.user.id },
          })
        : null;

    const customerProfile =
      req.user.role === 'CUSTOMER'
        ? await this.prisma.customerProfile.findUnique({
            where: { userId: req.user.id },
          })
        : null;

    const request = await this.serviceRequestsService.findOne(
      id,
      customerProfile?.userId,
      req.user.role,
    );
    return { data: request };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service request' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateServiceRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const request = await this.serviceRequestsService.update(id, updateDto, customer.id);
    return { data: request };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update service request status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const customer =
      req.user.role === 'CUSTOMER'
        ? await this.prisma.customerProfile.findUnique({
            where: { userId: req.user.id },
          })
        : null;

    const request = await this.serviceRequestsService.updateStatus(
      id,
      updateStatusDto.status,
      req.user.id,
      req.user.role,
    );
    return { data: request };
  }
}
