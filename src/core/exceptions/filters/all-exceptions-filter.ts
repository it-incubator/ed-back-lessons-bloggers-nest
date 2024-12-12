//Все ошибки
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception-filter';
import { Request, Response } from 'express';
import { CoreConfig, Environments } from '../../core.config';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private coreConfig: CoreConfig) {
    super();
  }
  onCatch(exception: unknown, response: Response, request: Request): void {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = this.coreConfig.env === Environments.PRODUCTION;

    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        ...this.getDefaultHttpBody(request.url, exception),
        path: null,
        message: 'Some error occurred',
      });

      return;
    }

    response
      .status(status)
      .json(this.getDefaultHttpBody(request.url, exception));
  }
}
