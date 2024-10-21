import { INestApplication, ValidationPipe } from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
  //Глобальный пайп для валидации и трансформации входящих данных.
  //На следующем занятии рассмотрим подробнее
  app.useGlobalPipes(
    new ValidationPipe({
      //эта настройка нужна для применения значений по-умолчанию
      transform: true,
      //эта настройка нужна для трансформации входящих параметров (например, "/?page=1"), будет трансформировано в number, если используется декоратор для валидации
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}
