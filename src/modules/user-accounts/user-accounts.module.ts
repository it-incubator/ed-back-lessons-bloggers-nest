import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { SecurityDevicesQueryRepository } from './infrastructure/query/security-devices.query-repository';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { UsersExternalQueryRepository } from './infrastructure/external-query/users.external-query-repository';
import { UsersExternalService } from './application/users.external-service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { CryptoService } from './application/crypto.service';
import { JwtStrategy } from './guards/bearer/jwt.strategy';

@Module({
  imports: [
    //если в системе несколько токенов (например, access и refresh) с разными опциями (время жизни, секрет)
    //можно переопределить опции при вызове метода jwt.service.sign
    //или написать свой tokens сервис (адаптер), где эти опции будут уже учтены
    //или использовать useFactory и регистрацию через токены для JwtService,
    //для создания нескольких экземпляров в IoC с разными настройками (пример в следующих занятиях)
    JwtModule.register({
      secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController, SecurityDevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    SecurityDevicesQueryRepository,
    AuthQueryRepository,
    AuthService,
    LocalStrategy,
    CryptoService,
    JwtStrategy,
    UsersExternalQueryRepository,
    UsersExternalService,
  ],
  exports: [JwtStrategy, UsersExternalQueryRepository, UsersExternalService],
})
export class UserAccountsModule {}
