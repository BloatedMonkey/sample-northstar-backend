/**
 * Email Job Processor
 * @author Arman Hazrati
 * @description Processes email jobs from the queue with idempotency support
 *
 * Note: This is a mock implementation. In production, integrate with:
 * - SendGrid (https://sendgrid.com)
 * - AWS SES (https://aws.amazon.com/ses/)
 * - Mailgun (https://www.mailgun.com)
 * - Nodemailer with SMTP
 */

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '../../common/logger/logger.service';

export interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
  idempotencyKey?: string;
}

/**
 * Email templates available for sending
 */
export enum EmailTemplate {
  SERVICE_REQUEST_SUBMITTED = 'service-request-submitted',
  SERVICE_REQUEST_COMPLETED = 'service-request-completed',
  PROVIDER_RESPONSE_RECEIVED = 'provider-response-received',
  WELCOME = 'welcome',
}

@Processor('email', {
  concurrency: 5,
})
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger();
  private readonly processedJobs = new Set<string>();

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, template, data, idempotencyKey } = job.data;

    // Idempotency check - prevent duplicate email sends
    if (idempotencyKey && this.processedJobs.has(idempotencyKey)) {
      this.logger.warn(
        `Skipping duplicate email job with idempotency key: ${idempotencyKey}`,
        'EmailProcessor',
      );
      return;
    }

    try {
      this.logger.log(
        `Processing email job ${job.id} - To: ${to}, Template: ${template}`,
        'EmailProcessor',
      );

      // Validate email address format
      if (!this.isValidEmail(to)) {
        throw new Error(`Invalid email address: ${to}`);
      }

      // Mock email sending - Replace with actual email service
      await this.sendEmail(to, subject, template, data);

      // Store idempotency key for 1 hour to prevent duplicates
      if (idempotencyKey) {
        this.processedJobs.add(idempotencyKey);
        setTimeout(() => this.processedJobs.delete(idempotencyKey), 3600000);
      }

      this.logger.log(
        `Email job ${job.id} completed successfully - Sent to ${to}`,
        'EmailProcessor',
      );
    } catch (error: any) {
      this.logger.error(
        `Email job ${job.id} failed: ${error?.message || 'Unknown error'}`,
        error?.stack,
        'EmailProcessor',
      );
      throw error;
    }
  }

  /**
   * Mock email sending implementation
   * Replace with actual email service integration
   */
  private async sendEmail(
    to: string,
    subject: string,
    template: string,
    data?: Record<string, any>,
  ): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Log email details (in production, this would send actual email)
    this.logger.log(
      `[MOCK EMAIL] To: ${to} | Subject: ${subject} | Template: ${template}`,
      'EmailProcessor',
    );

    if (data) {
      this.logger.debug(`Email data: ${JSON.stringify(data)}`, 'EmailProcessor');
    }

    // NOTE: For production, integrate with an email service:
    // - SendGrid: await this.sendGridService.send({ to, subject, html })
    // - AWS SES: await this.sesService.sendEmail({ to, subject, html })
    // - Nodemailer: await this.transporter.sendMail({ to, subject, html })
  }

  /**
   * Validate email address format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
