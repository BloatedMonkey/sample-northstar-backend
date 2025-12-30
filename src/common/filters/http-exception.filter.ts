import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as { message?: string | string[] };
        message = responseObj.message || 'Internal server error';
      }
    }

    const errorResponse = {
      error: {
        statusCode: status,
        message: Array.isArray(message) ? message : [message],
        timestamp: new Date().toISOString(),
        path: request.url,
        correlationId: request.correlationId || 'unknown',
      },
    };

    if (status >= 500) {
      this.logger.error(
        `Internal server error: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
        HttpExceptionFilter.name,
      );
    } else if (status >= 400) {
      this.logger.warn(`Client error: ${message} - Path: ${request.url}`, HttpExceptionFilter.name);
    }

    response.status(status).json(errorResponse);
  }
}
