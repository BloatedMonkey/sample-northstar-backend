import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestStatus } from '@prisma/client';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(customerProfileId: string, createDto: CreateServiceRequestDto) {
    const request = await this.prisma.serviceRequest.create({
      data: {
        customerId: customerProfileId,
        title: createDto.title,
        description: createDto.description,
        priority: createDto.priority || 0,
        metadata: createDto.metadata,
        status: ServiceRequestStatus.DRAFT,
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: customerProfileId },
      select: { userId: true },
    });

    if (customer) {
      await this.prisma.auditLog.create({
        data: {
          userId: customer.userId,
          action: 'CREATE',
          resource: 'SERVICE_REQUEST',
          resourceId: request.id,
        },
      });
    }

    return request;
  }

  async findAll(filters: {
    status?: ServiceRequestStatus;
    customerId?: string;
    q?: string;
    minPriority?: number;
    maxPriority?: number;
    startDate?: string;
    endDate?: string;
    sort?: string;
    skip: number;
    take: number;
  }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    if (filters.minPriority !== undefined || filters.maxPriority !== undefined) {
      where.priority = {};
      if (filters.minPriority !== undefined) {
        where.priority.gte = filters.minPriority;
      }
      if (filters.maxPriority !== undefined) {
        where.priority.lte = filters.maxPriority;
      }
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    const orderBy: any = { createdAt: 'desc' };
    if (filters.sort) {
      const [field, direction] = filters.sort.split(':');
      const validFields = ['createdAt', 'updatedAt', 'priority', 'status'];
      const validDirections = ['asc', 'desc'];
      if (
        field &&
        validFields.includes(field) &&
        direction &&
        validDirections.includes(direction)
      ) {
        orderBy[field] = direction;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where,
        skip: filters.skip,
        take: filters.take,
        orderBy,
        include: {
          customer: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          responses: {
            include: {
              provider: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: {
              responses: true,
              notes: true,
            },
          },
        },
      }),
      this.prisma.serviceRequest.count({ where }),
    ]);

    return { data, total };
  }

  async findOne(id: string, userId?: string, userRole?: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        responses: {
          include: {
            provider: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    if (userRole !== 'ADMIN' && userRole !== 'STAFF') {
      const customer = await this.prisma.customerProfile.findUnique({
        where: { id: request.customerId },
        select: { userId: true },
      });
      if (customer?.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }
    }

    return request;
  }

  async update(id: string, updateDto: UpdateServiceRequestDto, customerProfileId: string) {
    const request = await this.findOne(id);

    if (request.customerId !== customerProfileId) {
      throw new ForbiddenException('Only the owner can update this request');
    }

    return this.prisma.serviceRequest.update({
      where: { id },
      data: updateDto,
    });
  }

  async updateStatus(id: string, status: ServiceRequestStatus, userId: string, userRole: string) {
    const request = await this.findOne(id);

    const allowedTransitions: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
      DRAFT: [ServiceRequestStatus.SUBMITTED, ServiceRequestStatus.CANCELLED],
      SUBMITTED: [ServiceRequestStatus.IN_REVIEW, ServiceRequestStatus.CANCELLED],
      IN_REVIEW: [ServiceRequestStatus.ACCEPTED, ServiceRequestStatus.CANCELLED],
      ACCEPTED: [ServiceRequestStatus.IN_PROGRESS, ServiceRequestStatus.CANCELLED],
      IN_PROGRESS: [ServiceRequestStatus.COMPLETED, ServiceRequestStatus.CANCELLED],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!allowedTransitions[request.status].includes(status)) {
      throw new BadRequestException(`Cannot transition from ${request.status} to ${status}`);
    }

    if (status === ServiceRequestStatus.SUBMITTED) {
      const customer = await this.prisma.customerProfile.findUnique({
        where: { id: request.customerId },
        select: { userId: true },
      });
      if (customer?.userId !== userId) {
        throw new ForbiddenException('Only the owner can submit this request');
      }
    }

    if (
      [ServiceRequestStatus.IN_REVIEW, ServiceRequestStatus.ACCEPTED].includes(status as any) &&
      !['ADMIN', 'STAFF'].includes(userRole)
    ) {
      throw new ForbiddenException('Only staff or admin can perform this action');
    }

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        submittedAt: status === ServiceRequestStatus.SUBMITTED ? new Date() : request.submittedAt,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_STATUS',
        resource: 'SERVICE_REQUEST',
        resourceId: id,
        metadata: { from: request.status, to: status },
      },
    });

    if (status === ServiceRequestStatus.SUBMITTED) {
      const customer = await this.prisma.customerProfile.findUnique({
        where: { id: request.customerId },
        include: { user: { select: { email: true, id: true } } },
      });

      this.eventEmitter.emit('service-request.submitted', {
        requestId: id,
        customerId: customer?.user?.id || '',
        customerEmail: customer?.user?.email,
      });
    }

    if (status === ServiceRequestStatus.COMPLETED) {
      const customer = await this.prisma.customerProfile.findUnique({
        where: { id: request.customerId },
        include: { user: { select: { email: true, id: true } } },
      });

      this.eventEmitter.emit('service-request.completed', {
        requestId: id,
        customerId: customer?.user?.id || '',
        customerEmail: customer?.user?.email,
      });
    }

    return updated;
  }
}
