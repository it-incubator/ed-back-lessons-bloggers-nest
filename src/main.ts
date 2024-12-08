import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './config/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSetup(app); //глобальные настройки приложения

  const PORT = 5005;

  await app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
  });
}
bootstrap();
