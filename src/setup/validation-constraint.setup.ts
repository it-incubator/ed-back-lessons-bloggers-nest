import { DynamicModule, INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';

/**
 * Для внедрения зависимостей в validator constraint decorator
 * @param app
 * @param DynamicAppModule
 */
export const validationConstraintSetup = (
  app: INestApplication,
  DynamicAppModule: DynamicModule,
) => {
  // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
  // когда DI не имеет необходимого класса.
  const appContext = app.select(DynamicAppModule);

  useContainer(appContext, {
    fallbackOnErrors: true,
  });
};
