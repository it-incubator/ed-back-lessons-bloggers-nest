import { ITokenStrategy } from './auth-token.context';
import { JwtService } from '@nestjs/jwt';

export class AuthRefreshTokenStrategy
  implements ITokenStrategy<{ id: string; deviceId: string }>
{
  constructor(private jwtService: JwtService) {}
  sign(payload: { id: string; deviceId: string }): string {
    return this.jwtService.sign(
      { id: payload.id, deviceId: payload.deviceId },
      //TODO: from config service
      { expiresIn: '2d', secret: 'secret_key' },
    );
  }
}
