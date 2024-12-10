import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './guards/jwt.strategy';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  // exports: [GlobalLogerService],
  providers: [JwtStrategy],
})
@Module({
  imports: [CqrsModule],
  exports: [CqrsModule],
})
export class CoreModule {}
