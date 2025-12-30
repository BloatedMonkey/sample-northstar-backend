import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Logger } from '../../common/logger/logger.service';

@Injectable()
export class JobsListener {
  private readonly logger = new Logger();

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('cleanup') private cleanupQueue: Queue,
  ) {}

  @OnEvent('service-request.submitted')
  async handleServiceRequestSubmitted(payload: {
    requestId: string;
    customerId: string;
    customerEmail?: string;
  }) {
    this.logger.log(
      `Service request ${payload.requestId} submitted, queuing notification`,
      'JobsListener',
    );

    const idempotencyKey = `email-submitted-${payload.requestId}`;

    await this.emailQueue.add(
      'notification',
      {
        to: payload.customerEmail || 'customer@example.com',
        subject: 'Service Request Submitted',
        template: 'service-request-submitted',
        data: {
          requestId: payload.requestId,
          customerId: payload.customerId,
        },
        idempotencyKey,
      },
      {
        jobId: idempotencyKey,
      },
    );
  }

  @OnEvent('service-request.completed')
  async handleServiceRequestCompleted(payload: {
    requestId: string;
    customerId: string;
    customerEmail?: string;
  }) {
    this.logger.log(
      `Service request ${payload.requestId} completed, queuing notification`,
      'JobsListener',
    );

    const idempotencyKey = `email-completed-${payload.requestId}`;

    await this.emailQueue.add(
      'notification',
      {
        to: payload.customerEmail || 'customer@example.com',
        subject: 'Service Request Completed',
        template: 'service-request-completed',
        data: {
          requestId: payload.requestId,
          customerId: payload.customerId,
        },
        idempotencyKey,
      },
      {
        jobId: idempotencyKey,
      },
    );
  }
}
