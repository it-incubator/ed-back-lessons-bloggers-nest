import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtStrategy } from './guards/jwt.strategy';
import { CoreConfig } from './core.config';

//глобальный модуль для провайдеров и модулей необходимых во всех частях приложения (например LoggerService, CqrsModule, etc...)
@Global()
@Module({
  imports: [CqrsModule],
  exports: [CoreConfig, CqrsModule],
  providers: [JwtStrategy, CoreConfig],
})
export class CoreModule {}
