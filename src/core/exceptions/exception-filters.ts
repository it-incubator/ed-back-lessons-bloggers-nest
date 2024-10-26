import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DomainException, ErrorExtension } from './domain-exceptions';
import { DomainExceptionCode } from './domain-exception-codes';
import { Request, Response } from 'express';

type HttpResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: ErrorExtension[];
  code: DomainExceptionCode | null;
};

abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request): void;
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.onCatch(exception, response, request);
  }

  getDefaultHttpBody(url: string, exception: unknown): HttpResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: url,
      message: (exception as any).message || 'Internal server error',
      code: exception instanceof DomainException ? exception.code : null,
      extensions:
        exception instanceof DomainException ? exception.extensions : [],
    };
  }
}

//Все ошибки
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  onCatch(exception: unknown, response: Response, request: Request): void {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    //TODO: Replace with getter from configService
    const isProduction = process.env.ENV === 'PRODUCTION';

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

//Ошибки класса DomainException (instanceof DomainException)
@Catch(DomainException)
export class DomainExceptionsFilter extends BaseExceptionFilter {
  onCatch(
    exception: DomainException,
    response: Response,
    request: Request,
  ): void {
    const calculateHttpCode = (exception: DomainException) => {
      switch (exception.code) {
        case DomainExceptionCode.BedRequest: {
          return HttpStatus.BAD_REQUEST;
        }
        case DomainExceptionCode.Forbidden: {
          return HttpStatus.FORBIDDEN;
        }
        case DomainExceptionCode.NotFound: {
          return HttpStatus.NOT_FOUND;
        }
        case DomainExceptionCode.Unauthorized: {
          return HttpStatus.UNAUTHORIZED;
        }
        default: {
          return HttpStatus.I_AM_A_TEAPOT;
        }
      }
    };

    response
      .status(calculateHttpCode(exception))
      .json(this.getDefaultHttpBody(request.url, exception));
  }
}
