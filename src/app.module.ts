import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './features/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { AserAccountModule } from './aser-account/aser-account.module';
import { UsersController } from './features/users/users.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-bloggers-platform'), // Укажите свой URL MongoDB
    UserAccountsModule, //все модули должны быть заимпортированы в корневой модуль, либо напрямую, либо по цепочке (через другие модули)
    TestingModule,
    BloggersPlatformModule,
    CoreModule,
    AserAccountModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
