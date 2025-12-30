import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '../../common/logger/logger.service';

interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
  idempotencyKey?: string;
}

@Processor('email', {
  concurrency: 5,
})
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger();
  private readonly processedJobs = new Set<string>();

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, data, idempotencyKey } = job.data;

    if (idempotencyKey && this.processedJobs.has(idempotencyKey)) {
      this.logger.warn(
        `Skipping duplicate email job with idempotency key: ${idempotencyKey}`,
        'EmailProcessor',
      );
      return;
    }

    try {
      this.logger.log(`Processing email job ${job.id} to ${to}`, 'EmailProcessor');

      if (data) {
        this.logger.debug(`Email data: ${JSON.stringify(data)}`, 'EmailProcessor');
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (idempotencyKey) {
        this.processedJobs.add(idempotencyKey);
        setTimeout(() => this.processedJobs.delete(idempotencyKey), 3600000);
      }

      this.logger.log(`Email job ${job.id} completed`, 'EmailProcessor');
    } catch (error: any) {
      this.logger.error(
        `Email job ${job.id} failed: ${error?.message || 'Unknown error'}`,
        error?.stack,
        'EmailProcessor',
      );
      throw error;
    }
  }
}
