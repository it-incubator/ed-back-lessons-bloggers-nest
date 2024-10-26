import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './features/user-accounts/user-accounts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './features/testing/testing.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { CoreModule } from './core/core.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
  ConfigurationType,
  validate,
} from './config/env/configuration';
import { Environments } from './config/env/env-settings';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const databaseSettings = configService.get('databaseSettings', {
          infer: true,
        });

        const uri = databaseSettings.DB_URL;
        console.log('DB_URI', uri);

        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    UserAccountsModule, //все модули должны быть заимпортированы в корневой модуль, либо напрямую, либо по цепочке (через другие модули)
    TestingModule,
    BloggersPlatformModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      //игнорируем файлы конфигурации в production и staging
      ignoreEnvFile:
        process.env.ENV !== Environments.DEVELOPMENT &&
        process.env.ENV !== Environments.TEST,
      //указывает откуда брать конфигурации (приоритет справа налево)
      //.env.testing самый приоритетный в тестовой среде
      envFilePath: [
        process.env.ENV === Environments.TEST ? '.env.testing' : '',
        '.env.development.local',
        '.env.development',
        '.env',
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
