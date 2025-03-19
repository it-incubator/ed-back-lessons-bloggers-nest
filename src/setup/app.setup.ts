import { pipesSetup } from './pipes.setup';
import { DynamicModule, INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { validationConstraintSetup } from './validation-constraint.setup';
import { CoreConfig } from '@core/core.config';

export function appSetup(
  app: INestApplication,
  coreConfig: CoreConfig,
  DynamicAppModule: DynamicModule,
) {
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app, coreConfig.isSwaggerEnabled);
  validationConstraintSetup(app, DynamicAppModule);
}
