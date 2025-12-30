import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceRequestsService } from './service-requests.service';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceRequestStatus } from '@prisma/client';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;
  let prisma: PrismaService;

  const mockRequest = {
    id: '1',
    customerId: 'customer-1',
    title: 'Test Request',
    description: 'Test Description',
    status: ServiceRequestStatus.DRAFT,
    priority: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceRequestsService,
        {
          provide: PrismaService,
          useValue: {
            serviceRequest: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            auditLog: {
              create: jest.fn(),
            },
            customerProfile: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServiceRequestsService>(ServiceRequestsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException when request not found', async () => {
      (prisma.serviceRequest.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should return request when found', async () => {
      (prisma.serviceRequest.findUnique as jest.Mock).mockResolvedValue({
        ...mockRequest,
        customerId: 'customer-profile-1',
        customer: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
          },
        },
      });

      (prisma.customerProfile.findUnique as jest.Mock).mockResolvedValue({
        id: 'customer-profile-1',
        userId: 'user-1',
      });

      const result = await service.findOne('1', 'user-1', 'CUSTOMER');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });
  });
});
