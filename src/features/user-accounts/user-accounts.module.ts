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
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CryptoService } from './application/crypto.service';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-tokens.inject-constants';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { UserAccountsConfig } from './config/user-accounts.config';
import { JwtStrategy } from './guards/bearer/jwt.strategy';

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
      inject: [UsersRepository, getModelToken(User.name), CryptoService],
    },
    //пример инстанцирования через токен
    //если надо внедрить несколько раз один и тот же класс
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.accessTokenSecret,
          signOptions: { expiresIn: userAccountConfig.accessTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.refreshTokenSecret,
          signOptions: { expiresIn: userAccountConfig.refreshTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    UsersQueryRepository,
    SecurityDevicesQueryRepository,
    AuthQueryRepository,
    LoginIsExistConstraint,
    AuthService,
    LocalStrategy,
    CryptoService,
    LoginUserUseCase,
    UserAccountsConfig,
    JwtStrategy,
  ],
  exports: [UsersRepository, MongooseModule, JwtStrategy],
})
export class UserAccountsModule {}
