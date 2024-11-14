import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserContext } from '../../../../core/dto/user-context';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(username: string, password: string): Promise<UserContext> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw UnauthorizedDomainException.create();
    }

    return user;
  }
}
