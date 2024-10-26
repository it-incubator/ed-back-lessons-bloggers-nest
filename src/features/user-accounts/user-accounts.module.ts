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
import { USER_QUERY_REPO_TOKEN } from './constants/users.inject-tokens';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.usecase';
import { SendConfirmationEmailWhenUserCreatedEventHandler } from './application/event-handlers/send-confirmation-email-when-user-created.event-handler';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    //варианты регистрации провайдеров
    UsersRepository,
    DeleteUserUseCase,
    SendConfirmationEmailWhenUserCreatedEventHandler,
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
  ],
  exports: [UsersRepository, MongooseModule],
})
export class UserAccountsModule {}
