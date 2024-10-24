import { pipesSetup } from './pipes.setup';
import { INestApplication } from '@nestjs/common';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { validationConstraintSetup } from './validation-constraint.setup';

export function configApp(app: INestApplication) {
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
  validationConstraintSetup(app);
}
