import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderResponseDto } from './dto/create-provider-response.dto';

@Injectable()
export class ProviderResponsesService {
  constructor(private prisma: PrismaService) {}

  async create(serviceRequestId: string, providerId: string, createDto: CreateProviderResponseDto) {
    const serviceRequest = await this.prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
    });

    if (!serviceRequest) {
      throw new NotFoundException(`Service request with ID ${serviceRequestId} not found`);
    }

    if (serviceRequest.status === 'CANCELLED' || serviceRequest.status === 'COMPLETED') {
      throw new ForbiddenException('Cannot respond to cancelled or completed requests');
    }

    const response = await this.prisma.providerResponse.create({
      data: {
        serviceRequestId,
        providerId,
        quote: createDto.quote,
        message: createDto.message,
        estimatedDays: createDto.estimatedDays,
        status: 'PENDING',
      },
      include: {
        provider: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        serviceRequest: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: providerId,
        action: 'CREATE',
        resource: 'PROVIDER_RESPONSE',
        resourceId: response.id,
        metadata: { serviceRequestId },
      },
    });

    return response;
  }

  async findByServiceRequest(serviceRequestId: string) {
    return this.prisma.providerResponse.findMany({
      where: { serviceRequestId },
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
    });
  }

  async findByProvider(providerId: string, skip: number, take: number) {
    const [data, total] = await Promise.all([
      this.prisma.providerResponse.findMany({
        where: { providerId },
        skip,
        take,
        include: {
          serviceRequest: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.providerResponse.count({ where: { providerId } }),
    ]);

    return { data, total };
  }
}
