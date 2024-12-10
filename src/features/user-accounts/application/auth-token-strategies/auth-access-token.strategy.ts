import { ITokenStrategy } from './auth-token.context';
import { JwtService } from '@nestjs/jwt';
import { UserContext } from '../../../../core/dto/user-context';

export class AuthAccessTokenStrategy implements ITokenStrategy<UserContext> {
  constructor(private jwtService: JwtService) {}
  sign(payload: { id: string }): string {
    return this.jwtService.sign(
      { id: payload.id },
      //TODO: from config service
      { expiresIn: '10m', secret: 'secret_key' },
    );
  }
}
