import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './config/app.setup';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './config/env/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appSetup(app); //глобальные настройки приложения

  const configService = app.get(ConfigService<ConfigurationType, true>);
  const apiSettings = configService.get('apiSettings', { infer: true });
  const environmentSettings = configService.get('environmentSettings', {
    infer: true,
  });
  const port = apiSettings.PORT;

  await app.listen(port, () => {
    console.log('App starting listen port: ', port);
    console.log('ENV: ', environmentSettings.currentEnv);
  });
}
bootstrap();
