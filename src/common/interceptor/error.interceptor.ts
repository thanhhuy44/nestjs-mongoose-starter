// common/interceptors/error.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

import { ApiResponse } from '@/types';

@Injectable()
export class ErrorInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      catchError((error) => {
        // Default values
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errorName = 'InternalServerError';

        if (error instanceof HttpException) {
          statusCode = error.getStatus();
          const response = error.getResponse();

          if (typeof response === 'string') {
            message = response;
          } else if (typeof response === 'object' && response !== null) {
            message = (response as { message: string }).message || message;
          }

          errorName = error.name;
        }

        const apiResponse: ApiResponse<null> = {
          timestamp: Date.now(),
          statusCode,
          message,
          data: null,
          error: errorName,
        };

        // Trả về lỗi được wrap lại trong HttpException, để NestJS response JSON
        return throwError(() => new HttpException(apiResponse, statusCode));
      }),
    );
  }
}
