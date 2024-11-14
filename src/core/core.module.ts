import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from './guards/jwt.strategy';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  // exports: [GlobalLogerService],
  providers: [JwtStrategy],
})
export class CoreModule {}
