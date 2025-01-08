import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly validUsername = 'admin';
  private readonly validPassword = 'qwerty';

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    //https://docs.nestjs.com/security/authentication#enable-authentication-globally
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw UnauthorizedDomainException.create();
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');

    if (username === this.validUsername && password === this.validPassword) {
      return true;
    } else {
      throw UnauthorizedDomainException.create();
    }
  }
}
