import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { CoreConfig } from '../../core.config';

//https://docs.nestjs.com/exception-filters#exception-filters-1
//Все ошибки
@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  constructor(private coreConfig: CoreConfig) {
    console.log(coreConfig);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveHttpStatus(exception);
    const message = this.extractMessage(exception);
    const responseBody = this.buildResponseBody(status, request.url, message);

    response.status(status).json(responseBody);
  }

  private resolveHttpStatus(exception: unknown): number {
    //хотя мы используем кастомные domain exception,
    //NestJs все еще может выбросить стандартное http исключение в определенных сценариях
    //например, если мы не переопределили поведение passport strategy
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildResponseBody(
    status: number,
    requestUrl: string,
    message: string,
  ): ErrorResponseBody {
    if (
      !this.coreConfig.sendInternalServerErrorDetails &&
      status === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      return {
        timestamp: new Date().toISOString(),
        path: null,
        message: 'Some error occurred',
        extensions: [],
        code: null,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      path: requestUrl,
      message,
      extensions: [],
      code: null,
    };
  }

  private extractMessage(exception: unknown): string {
    const UNKNOWN_ERROR_MESSAGE = 'Internal server unknown error';
    if (exception instanceof Error) {
      return exception.message || UNKNOWN_ERROR_MESSAGE;
    }
    return UNKNOWN_ERROR_MESSAGE;
  }
}
