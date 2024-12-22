import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import {PaginateResult} from 'mongoose';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) => throwError(() => this.errorHandler(err, context))),
    )
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    return response.status(status).json({
      success: false,
      status: status,
      message: exception.message,
      type: exception.name,
    })
  }

  async responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()
    const statusCode = typeof res?.status === 'number' ? res.status : HttpStatus.OK
    if (response.status) response.status(statusCode)

    let data: any, message: any
    if (res?.message) message = res.message
    if (res?.data) {
      data = res.data
    } else {
      if (res?.message) {
        const {message, ...fields} = res
        res = fields
      }
      data = res
    }

    const paginationResult = (res?._pagination || {}) as PaginateResult<any>
    if (res?._pagination) {
      data.pagination = {
        page: paginationResult.page,
        totalPages: paginationResult.totalPages,
        hasNext: paginationResult.hasNextPage,
        totalItems: paginationResult.totalDocs,
      }
    }

    return {
      message: message || 'SUCCESS',
      data: data,
      pagination: data?.pagination,
    }
  }
}