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
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from './application/crypto.service';
import { USER_QUERY_REPO_TOKEN } from './constants/users.inject-tokens';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';

@Module({
  imports: [
    //если в системе несколько токенов (например, access и refresh) с разными опциями (время жизни, секрет)
    //можно переопределить опции при вызове метода jwt.service.sign
    //или написать свой tokens сервис (адаптер), где эти опции будут уже учтены
    JwtModule.register({
      secret: 'secret_key', // секретный ключ (должен браться из env)
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
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
      useFactory: (
        userRepository: UsersRepository,
        UserModel: UserModelType,
      ) => {
        return new CreateUserUseCase(UserModel, userRepository);
      },
      inject: [UsersRepository, getModelToken(User.name)],
    },
    {
      provide: USER_QUERY_REPO_TOKEN,
      useClass: UsersQueryRepository,
      //useValue: {},
    },
    SecurityDevicesQueryRepository,
    AuthQueryRepository,
    LoginIsExistConstraint,
    AuthService,
    LocalStrategy,
    CryptoService,
  ],
  exports: [UsersRepository, MongooseModule],
})
export class UserAccountsModule {}
