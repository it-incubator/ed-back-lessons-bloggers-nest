import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { SecurityDevicesQueryRepository } from './infrastructure/query/security-devices.query-repository';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CryptoService } from './application/crypto.service';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-tokens.inject-constants';
import { CreateUserUseCase } from './application/usecases/admins/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/admins/delete-user.usecase';
import { RegisterUserUseCase } from './application/usecases/users/register-user.usecase';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { UsersExternalService } from './application/users.external-service';
import { GetUserByIdQueryHandler } from './application/queries/get-user-by-id.query';

const commandHandlers = [
  DeleteUserUseCase,
  RegisterUserUseCase,
  CreateUserUseCase,
];

const queryHandlers = [GetUserByIdQueryHandler];

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    //варианты регистрации провайдеров
    UsersRepository,
    {
      provide: AuthService,
      //вмешиваемся в процесс и вручную инстанцируем класс
      useFactory: (
        usersRepository: UsersRepository,
        cryptoService: CryptoService,
      ) => {
        return new AuthService(usersRepository, cryptoService);
      },
      inject: [UsersRepository, CryptoService],
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
    LocalStrategy,
    CryptoService,
    LoginUserUseCase,
    JwtStrategy,
    UsersExternalQueryRepository,
    UsersExternalService,
  ],
  exports: [JwtStrategy, UsersExternalQueryRepository, UsersExternalService],
})
export class UserAccountsModule {}
