import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserContext } from '../../../../core/dto/user-context';
import { AuthTokenContext } from '../auth-token-strategies/auth-token.context';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  FRIEND_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constants/auth-tokens.inject-constants';

export class LoginUserCommand {
  constructor(public dto: { userId: string }) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: AuthTokenContext<UserContext>,

    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: AuthTokenContext<
      UserContext & { deviceId: string }
    >,

    @Inject(FRIEND_TOKEN_STRATEGY_INJECT_TOKEN)
    private friendTokenContext: AuthTokenContext<UserContext>,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<{ accessToken: string }> {
    const accessToken = this.accessTokenContext.executeTokenSign({
      id: dto.userId,
    });

    const refreshToken = this.refreshTokenContext.executeTokenSign({
      id: dto.userId,
      deviceId: 'deviceId',
    });

    const friendToken = this.friendTokenContext.executeTokenSign({
      id: dto.userId,
    });

    console.log('refreshToken', refreshToken);
    console.log('friendToken', friendToken);

    return {
      accessToken,
    };
  }
}
