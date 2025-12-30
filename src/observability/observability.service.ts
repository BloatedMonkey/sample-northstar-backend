import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ObservabilityService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [totalUsers, activeUsers, totalRequests, completedRequests, pendingResponses] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { status: 'ACTIVE' } }),
        this.prisma.serviceRequest.count(),
        this.prisma.serviceRequest.count({ where: { status: 'COMPLETED' } }),
        this.prisma.providerResponse.count({ where: { status: 'PENDING' } }),
      ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      serviceRequests: {
        total: totalRequests,
        completed: completedRequests,
      },
      providerResponses: {
        pending: pendingResponses,
      },
    };
  }

  async getPrometheusMetrics(): Promise<string> {
    const metrics = await this.getMetrics();

    return `# HELP northstar_users_total Total number of users
# TYPE northstar_users_total gauge
northstar_users_total ${metrics.users.total}

# HELP northstar_users_active Total number of active users
# TYPE northstar_users_active gauge
northstar_users_active ${metrics.users.active}

# HELP northstar_service_requests_total Total number of service requests
# TYPE northstar_service_requests_total gauge
northstar_service_requests_total ${metrics.serviceRequests.total}

# HELP northstar_service_requests_completed Total number of completed service requests
# TYPE northstar_service_requests_completed gauge
northstar_service_requests_completed ${metrics.serviceRequests.completed}

# HELP northstar_provider_responses_pending Total number of pending provider responses
# TYPE northstar_provider_responses_pending gauge
northstar_provider_responses_pending ${metrics.providerResponses.pending}
`;
  }
}
