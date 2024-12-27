import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

/**
 * Для внедрения зависимостей в validator constraint decorator
 * @param app
 */
export const validationConstraintSetup = (app: INestApplication) => {
  // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
  // когда DI не имеет необходимого класса.
  const appContext = app.select(AppModule);

  useContainer(appContext, {
    fallbackOnErrors: true,
  });
};
