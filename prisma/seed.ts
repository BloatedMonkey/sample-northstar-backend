import { PrismaClient, UserRole, UserStatus, ServiceRequestStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@northstar.com' },
    update: {},
    create: {
      email: 'admin@northstar.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  const businessOwner = await prisma.user.upsert({
    where: { email: 'business@northstar.com' },
    update: {},
    create: {
      email: 'business@northstar.com',
      password: hashedPassword,
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
      firstName: 'Business',
      lastName: 'Owner',
      business: {
        create: {
          name: 'Acme Services',
          description: 'Professional service provider',
          settings: {
            notifications: true,
            autoAccept: false,
          },
        },
      },
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@northstar.com' },
    update: {},
    create: {
      email: 'staff@northstar.com',
      password: hashedPassword,
      role: UserRole.STAFF,
      status: UserStatus.ACTIVE,
      firstName: 'Staff',
      lastName: 'Member',
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@northstar.com' },
    update: {},
    create: {
      email: 'customer1@northstar.com',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      firstName: 'John',
      lastName: 'Doe',
      customerProfile: {
        create: {
          phone: '+1234567890',
          address: '123 Main St, Toronto, ON',
        },
      },
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@northstar.com' },
    update: {},
    create: {
      email: 'customer2@northstar.com',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      firstName: 'Jane',
      lastName: 'Smith',
      customerProfile: {
        create: {
          phone: '+1234567891',
          address: '456 Oak Ave, Toronto, ON',
        },
      },
    },
  });

  const request1 = await prisma.serviceRequest.create({
    data: {
      customerId: customer1.id,
      title: 'Website Development',
      description: 'Need a new company website with e-commerce functionality',
      status: ServiceRequestStatus.SUBMITTED,
      priority: 2,
      submittedAt: new Date(),
      metadata: {
        budget: 5000,
        deadline: '2024-03-01',
      },
    },
  });

  const request2 = await prisma.serviceRequest.create({
    data: {
      customerId: customer2.id,
      title: 'Mobile App Design',
      description: 'UI/UX design for iOS and Android app',
      status: ServiceRequestStatus.IN_REVIEW,
      priority: 1,
      submittedAt: new Date(),
      metadata: {
        budget: 3000,
        deadline: '2024-02-15',
      },
    },
  });

  await prisma.providerResponse.create({
    data: {
      serviceRequestId: request1.id,
      providerId: businessOwner.id,
      quote: 4500,
      message: 'We can deliver this within 6 weeks. Includes responsive design and basic SEO.',
      estimatedDays: 42,
      status: 'PENDING',
    },
  });

  await prisma.note.create({
    data: {
      serviceRequestId: request1.id,
      authorId: staff.id,
      content: 'Initial review completed. Customer has approved budget range.',
      isInternal: true,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

