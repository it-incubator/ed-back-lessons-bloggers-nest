//Ошибки класса DomainException (instanceof DomainException)
import { Catch, HttpStatus } from '@nestjs/common';
import { DomainException } from '../domain-exceptions';
import {
  BaseHttpExceptionFilter,
  HttpResponseBody,
} from './base-exception-filter';
import { Request } from 'express';
import { DomainExceptionCode } from '../domain-exception-codes';

@Catch(DomainException)
export class DomainHttpExceptionsFilter extends BaseHttpExceptionFilter<DomainException> {
  getStatus(exception: DomainException): number {
    switch (exception.code) {
      case DomainExceptionCode.BadRequest:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  getResponseBody(
    exception: DomainException,
    request: Request,
  ): HttpResponseBody {
    return {
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      code: exception.code,
      extensions: exception.extensions,
    };
  }
}
