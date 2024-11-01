import { DynamicModule, Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';

@Module({})
export class TestingModule {
  static register(env: string): DynamicModule {
    if (env !== 'PRODUCTION') {
      return {
        module: TestingModule,
        imports: [UserAccountsModule],
        controllers: [TestingController],
        providers: [],
      };
    }

    return {
      module: TestingModule,
      // Пустой массив controllers, чтобы отключить модуль
      providers: [],
      imports: [],
      controllers: [],
    };
  }
}
