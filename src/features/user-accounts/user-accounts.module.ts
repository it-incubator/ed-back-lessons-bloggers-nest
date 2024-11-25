import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserModelType, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { SecurityDevicesQueryRepository } from './infrastructure/query/security-devices.query-repository';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { LoginIsExistConstraint } from './api/validation/login-is-exist.decorator';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './api/guards/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CryptoService } from './application/crypto.service';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  FRIEND_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-tokens.inject-constants';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { AuthAccessTokenStrategy } from './application/auth-token-strategies/auth-access-token.strategy';
import { AuthRefreshTokenStrategy } from './application/auth-token-strategies/auth-refresh-token.strategy';
import { AuthFriendTokenStrategy } from './application/auth-token-strategies/auth-friend-token.strategy';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { AuthTokenContext } from './application/auth-token-strategies/auth-token.context';
import { UserContext } from '../../core/dto/user-context';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    //варианты регистрации провайдеров
    UsersRepository,
    DeleteUserUseCase,
    RegisterUserUseCase,
    {
      provide: CreateUserUseCase,
      //вмешиваемся в процесс и вручную инстанцируем класс
      useFactory: (
        userRepository: UsersRepository,
        UserModel: UserModelType,
        cryptoService: CryptoService,
      ) => {
        return new CreateUserUseCase(UserModel, userRepository, cryptoService);
      },
      inject: [UsersRepository, getModelToken(User.name)],
    },
    //пример инстанцирования через токен
    //если надо внедрить несколько раз один и тот же класс
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (jwtService: JwtService): AuthTokenContext<UserContext> => {
        return new AuthTokenContext(new AuthAccessTokenStrategy(jwtService));
      },
      inject: [JwtService],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (
        jwtService: JwtService,
      ): AuthTokenContext<UserContext & { deviceId: string }> => {
        return new AuthTokenContext(new AuthRefreshTokenStrategy(jwtService));
      },
      inject: [JwtService],
    },
    {
      provide: FRIEND_TOKEN_STRATEGY_INJECT_TOKEN,
      useValue: new AuthTokenContext(new AuthFriendTokenStrategy()),
    },
    UsersQueryRepository,
    SecurityDevicesQueryRepository,
    AuthQueryRepository,
    LoginIsExistConstraint,
    AuthService,
    LocalStrategy,
    CryptoService,
    LoginUserUseCase,
  ],
  exports: [UsersRepository, MongooseModule],
})
export class UserAccountsModule {}
