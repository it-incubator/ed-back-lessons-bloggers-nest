import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/core.config';
import { initAppModule } from './init-app-module';

async function bootstrap() {
  // создаём на основе донастроенного модуля наше приложение
  const dynamicAppModule = await initAppModule();
  const app = await NestFactory.create(dynamicAppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  await appSetup(app, coreConfig); //глобальные настройки приложения

  const port = coreConfig.port;

  await app.listen(port, () => {
    console.log('App starting listen port: ', port);
    console.log('NODE_ENV: ', coreConfig.env);
  });
}
bootstrap();
