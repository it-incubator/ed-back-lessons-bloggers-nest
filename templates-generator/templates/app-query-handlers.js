const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('../utils');

const queryHandlers = {
  'application/queries/get-*-by-id.query-handler.ts': (
    name,
  ) => `import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ${toPascalCase(name)}QueryRepository } from '../../infrastructure/query/${kebabCase(name)}.query-repository';
import { ${toPascalCase(singularize(name))}ViewDto } from '../../api/view-dto/${singularize(kebabCase(name))}.view-dto';
import { Types } from 'mongoose';

export class Get${toPascalCase(singularize(name))}ByIdQuery {
  constructor(public id: Types.ObjectId) {}
}

@QueryHandler(Get${toPascalCase(singularize(name))}ByIdQuery)
export class Get${toPascalCase(singularize(name))}ByIdQueryHandler
  implements IQueryHandler<Get${toPascalCase(singularize(name))}ByIdQuery, ${toPascalCase(singularize(name))}ViewDto>
{
  constructor(
    @Inject(${toPascalCase(name)}QueryRepository)
    private readonly ${toCamelCase(name)}QueryRepository: ${toPascalCase(name)}QueryRepository,
  ) {}

  async execute(query: Get${toPascalCase(singularize(name))}ByIdQuery): Promise<${toPascalCase(singularize(name))}ViewDto> {
    return this.${toCamelCase(name)}QueryRepository.getByIdOrNotFoundFail(query.id);
  }
}`,
  //-------------------
  'application/queries/get-*.query-handler.ts': (
    name,
  ) => `import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ${toPascalCase(name)}QueryRepository } from '../../infrastructure/query/${kebabCase(name)}.query-repository';
import { Get${toPascalCase(name)}QueryParams } from '../../api/input-dto/${kebabCase(name)}-query-params.input-dto';
import { ${toPascalCase(singularize(name))}ViewDto } from '../../api/view-dto/${singularize(kebabCase(name))}.view-dto';
import { PaginatedViewDto } from 'SPECIFY_IMPORT';

export class Get${toPascalCase(name)}Query {
  constructor(public queryParams: Get${toPascalCase(name)}QueryParams) {}
}

@QueryHandler(Get${toPascalCase(name)}Query)
export class Get${toPascalCase(name)}QueryHandler
  implements IQueryHandler<Get${toPascalCase(name)}Query, PaginatedViewDto<${toPascalCase(singularize(name))}ViewDto[]>>
{
  constructor(
    @Inject(${toPascalCase(name)}QueryRepository)
    private readonly ${toCamelCase(name)}QueryRepository: ${toPascalCase(name)}QueryRepository,
  ) {}

  async execute(query: Get${toPascalCase(name)}Query): Promise<PaginatedViewDto<${toPascalCase(singularize(name))}ViewDto[]>> {
    return this.${toCamelCase(name)}QueryRepository.getAll(query.queryParams);
  }
}`,
};

module.exports = queryHandlers;
