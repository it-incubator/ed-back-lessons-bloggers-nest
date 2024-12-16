import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { CoreConfig } from '../core/core.config';

/**
 * Для внедрения зависимостей в validator constraint decorator
 * @param app
 * @param coreConfig
 */
export const validationConstraintSetup = async (
  app: INestApplication,
  coreConfig: CoreConfig,
) => {
  // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
  // когда DI не имеет необходимого класса.
  const appContext = app.select(await AppModule.forRoot(coreConfig));

  useContainer(appContext, {
    fallbackOnErrors: true,
  });
};
