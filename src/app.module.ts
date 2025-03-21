import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './features/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-bloggers-platform'), //TODO: move to env. will be in the following lessons
    UserAccountsModule, //все модули должны быть заимпортированы в корневой модуль, либо напрямую, либо по цепочке (через другие модули)
    TestingModule,
    BloggersPlatformModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //регистрация глобальных exception filters
    //важен порядок регистрации! Первым сработает DomainHttpExceptionsFilter!
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
