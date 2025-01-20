const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('../utils');

const apiControllers = {
  'api/*.controller.ts': (
    name,
  ) => `import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { Create${toPascalCase(singularize(name))}Command } from '../application/usecases/create-${singularize(kebabCase(name))}.usecase';
import { Update${toPascalCase(singularize(name))}Command } from '../application/usecases/update-${singularize(kebabCase(name))}.usecase';
import { Delete${toPascalCase(singularize(name))}Command } from '../application/usecases/delete-${singularize(kebabCase(name))}.usecase';
import { Get${toPascalCase(singularize(name))}ByIdQuery } from '../application/queries/get-${singularize(kebabCase(name))}-by-id.query-handler';
import { Get${toPascalCase(name)}Query } from '../application/queries/get-${kebabCase(name)}.query-handler';
import { Create${toPascalCase(singularize(name))}InputDto } from './input-dto/create-${singularize(kebabCase(name))}.input-dto';
import { Update${toPascalCase(singularize(name))}InputDto } from './input-dto/update-${singularize(kebabCase(name))}.input-dto';
import { Get${toPascalCase(name)}QueryParams } from './input-dto/${kebabCase(name)}-query-params.input-dto';
import { ${toPascalCase(singularize(name))}ViewDto } from './view-dto/${singularize(kebabCase(name))}.view-dto';
import { PaginatedViewDto } from 'SPECIFY_IMPORT';

@Controller('${kebabCase(name)}')
export class ${toPascalCase(name)}Controller {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body() dto: Create${toPascalCase(singularize(name))}InputDto,
  ): Promise<${toPascalCase(singularize(name))}ViewDto> {
    return this.commandBus.execute<
      Create${toPascalCase(singularize(name))}Command,
      ${toPascalCase(singularize(name))}ViewDto
    >(new Create${toPascalCase(singularize(name))}Command(dto));
  }

  @Put(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: Update${toPascalCase(singularize(name))}InputDto,
  ): Promise<${toPascalCase(singularize(name))}ViewDto> {
    return this.commandBus.execute<
      Update${toPascalCase(singularize(name))}Command,
      ${toPascalCase(singularize(name))}ViewDto
    >(new Update${toPascalCase(singularize(name))}Command(id, dto));
  }

  @Delete(':id')
  async delete(
    @Param('id') id: Types.ObjectId,
  ): Promise<void> {
    return this.commandBus.execute<
      Delete${toPascalCase(singularize(name))}Command,
      void
    >(new Delete${toPascalCase(singularize(name))}Command(id));
  }

  @Get(':id')
  async get(
    @Param('id') id: Types.ObjectId,
  ): Promise<${toPascalCase(singularize(name))}ViewDto> {
    return this.queryBus.execute<
      Get${toPascalCase(singularize(name))}ByIdQuery,
      ${toPascalCase(singularize(name))}ViewDto
    >(new Get${toPascalCase(singularize(name))}ByIdQuery(id));
  }

  @Get()
  async getAll(
    @Query() queryParams: Get${toPascalCase(name)}QueryParams,
  ): Promise<PaginatedViewDto<${toPascalCase(singularize(name))}ViewDto[]>> {
    return this.queryBus.execute<
      Get${toPascalCase(name)}Query,
      PaginatedViewDto<${toPascalCase(singularize(name))}ViewDto[]>
    >(new Get${toPascalCase(name)}Query(queryParams));
  }
}`,
};

module.exports = apiControllers;
