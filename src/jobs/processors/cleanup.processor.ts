import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '../../common/logger/logger.service';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('cleanup')
export class CleanupProcessor extends WorkerHost {
  private readonly logger = new Logger();

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing cleanup job ${job.id}`, 'CleanupProcessor');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedAuditLogs = await this.prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    this.logger.log(
      `Cleanup completed: deleted ${deletedAuditLogs.count} old audit logs`,
      'CleanupProcessor',
    );
  }
}
