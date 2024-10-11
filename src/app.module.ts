import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { AuthModule } from './features/auth/auth.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-bloggers-platform'), // Укажите свой URL MongoDB
    UsersModule, //все модули должны быть заимпортированы в корневой модуль, либо напрямую, либо по цепочке (через другие модули)
    TestingModule,
    BloggersPlatformModule,
    AuthModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
