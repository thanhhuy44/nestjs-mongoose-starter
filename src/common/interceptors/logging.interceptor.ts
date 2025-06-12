import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = ctx.getResponse();
          const { statusCode } = response;
          const contentLength = response.get('content-length');
          const responseTime = Date.now() - startTime;

          this.logger.log(
            `${method} ${originalUrl} ${statusCode} ${responseTime}ms - ${contentLength} - ${ip} - ${userAgent}`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          
          this.logger.error(
            `${method} ${originalUrl} ${error.status || 500} ${responseTime}ms - ${ip} - ${userAgent}`,
            error.stack,
          );
        },
      }),
    );
  }
}