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
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '5m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret', //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '10m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    UsersQueryRepository,
    SecurityDevicesQueryRepository,
    AuthQueryRepository,
    LoginIsExistConstraint,
    AuthService,
    LocalStrategy,
    CryptoService,
    LoginUserUseCase,
    JwtStrategy,
  ],
  exports: [UsersRepository, JwtStrategy],
})
export class UserAccountsModule {}
