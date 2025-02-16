import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import { UserContextDto } from '../dto/user-context.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(username: string, password: string): Promise<UserContextDto> {
    // const loginDto = new LoginInputDto();
    // const error = classValidator.validate(loginDto);
    // if (error.length) {
    //   throw new BadRequest();
    // }
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw UnauthorizedDomainException.create();
    }

    return user;
  }
}
