import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserContext } from '../dto/user-context';
import { CoreConfig } from '../core.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(coreConfig: CoreConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: coreConfig.accessTokenSecret, //from env
    });
  }

  /**
   * функция принимает payload из jwt токена и возвращает то, что будет записано в req.user
   * @param payload
   */
  async validate(payload: UserContext): Promise<UserContext> {
    return payload;
  }
}
