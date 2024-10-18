import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp } from './config/config-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configApp(app); //глобальные настройки приложения

  await app.listen(5005);
}
bootstrap();
