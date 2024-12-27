import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup/app.setup';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSetup(app); //глобальные настройки приложения

  const port = process.env.PORT || 5005; //TODO: move to configService. will be in the following lessons

  await app.listen(port, () => {
    console.log('App starting listen port: ', port);
  });
}
bootstrap();
