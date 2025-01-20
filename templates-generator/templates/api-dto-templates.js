const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('../utils');

const apiDtoTemplates = {
  'api/input-dto/create*.input-dto.ts': (
    name,
  ) => `import { IsString } from 'class-validator';

export class Create${toPascalCase(singularize(name))}InputDto {
  @IsString()
  name: string;
}`,
  //---------------------
  'api/input-dto/update*.input-dto.ts': (
    name,
  ) => `import { PartialType } from '@nestjs/mapped-types';
  import { Create${toPascalCase(singularize(name))}InputDto } from './create-${singularize(kebabCase(name))}.input-dto';

export class Update${toPascalCase(singularize(name))}InputDto extends PartialType(Create${toPascalCase(singularize(name))}InputDto) {}
`,

  //------------------

  'api/input-dto/*-query-params.input-dto.ts': (
    name,
  ) => `import { BaseSortablePaginationParams } from 'SPECIFY_IMPORT';
import { ${toPascalCase(name)}SortBy } from './${name}-sort-by';
import { IsEnum } from 'class-validator';
export class Get${toPascalCase(name)}QueryParams extends BaseSortablePaginationParams<${toPascalCase(name)}SortBy> {
  @IsEnum(${toPascalCase(name)}SortBy)
  sortBy = ${toPascalCase(name)}SortBy.CreatedAt;
}
`,

  //------------------

  'api/input-dto/*-sort-by.ts': (
    name,
  ) => `export enum ${toPascalCase(name)}SortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}`,

  'api/view-dto/*.ts': (
    name,
  ) => `import { ${toPascalCase(singularize(name))}Document } from '../../domain/${singularize(kebabCase(name))}.entity';

export class ${toPascalCase(singularize(name))}ViewDto {
  id: string;
  name: string;

  static mapToView(${toPascalCase(singularize(name))}: ${toPascalCase(singularize(name))}Document): ${toPascalCase(singularize(name))}ViewDto {
    const dto = new ${toPascalCase(singularize(name))}ViewDto();
    dto.id = ${toPascalCase(singularize(name))}._id.toString();
    dto.name = ${toPascalCase(singularize(name))}.name;

    return dto;
  }
}`,
};

module.exports = apiDtoTemplates;
