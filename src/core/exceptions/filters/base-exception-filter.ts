import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorExtension } from '../domain-exceptions';
import { DomainExceptionCode } from '../domain-exception-codes';

export type HttpResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: ErrorExtension[];
  code: DomainExceptionCode | null;
};

export abstract class BaseHttpExceptionFilter<T = unknown>
  implements ExceptionFilter
{
  abstract getStatus(exception: T): number;
  abstract getResponseBody(exception: T, request: Request): HttpResponseBody;

  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const responseBody = this.getResponseBody(exception, request);

    response.status(status).json(responseBody);
  }
}
