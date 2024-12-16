import { pipesSetup } from './pipes.setup';
import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { validationConstraintSetup } from './validation-constraint.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { CoreConfig } from '../core/core.config';

export async function appSetup(app: INestApplication, coreConfig: CoreConfig) {
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app, coreConfig);
  await validationConstraintSetup(app, coreConfig);
  exceptionFilterSetup(app, coreConfig);
}
