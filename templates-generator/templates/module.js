const { kebabCase, singularize, toPascalCase } = require('../utils');

const moduleTemplate = {
  '*.module.ts': (name) => `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ${toPascalCase(name)}Controller } from './api/${kebabCase(name)}.controller';
import { Create${toPascalCase(singularize(name))}UseCase } from './application/usecases/create-${singularize(kebabCase(name))}.usecase';
import { Update${toPascalCase(singularize(name))}UseCase } from './application/usecases/update-${singularize(kebabCase(name))}.usecase';
import { Delete${toPascalCase(singularize(name))}UseCase } from './application/usecases/delete-${singularize(kebabCase(name))}.usecase';
import { Get${toPascalCase(singularize(name))}ByIdQueryHandler } from './application/queries/get-${singularize(kebabCase(name))}-by-id.query-handler';
import { Get${toPascalCase(name)}QueryHandler } from './application/queries/get-${kebabCase(name)}.query-handler';
import { ${toPascalCase(name)}QueryRepository } from './infrastructure/query/${kebabCase(name)}.query-repository';
import { ${toPascalCase(name)}Repository } from './infrastructure/${kebabCase(name)}.repository';
import { ${toPascalCase(singularize(name))}Schema, ${toPascalCase(singularize(name))} } from './domain/${singularize(kebabCase(name))}.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ${toPascalCase(singularize(name))}.name, schema: ${toPascalCase(singularize(name))}Schema },
    ]),
  ],
  controllers: [${toPascalCase(name)}Controller],
  providers: [
    Create${toPascalCase(singularize(name))}UseCase,
    Update${toPascalCase(singularize(name))}UseCase,
    Delete${toPascalCase(singularize(name))}UseCase,
    Get${toPascalCase(singularize(name))}ByIdQueryHandler,
    Get${toPascalCase(name)}QueryHandler,
    ${toPascalCase(name)}QueryRepository,
    ${toPascalCase(name)}Repository,
  ],
  exports: [],
})
export class ${toPascalCase(name)}Module {}
`,
};

module.exports = moduleTemplate;
