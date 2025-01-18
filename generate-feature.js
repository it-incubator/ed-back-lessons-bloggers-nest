const fs = require('fs');
const path = require('path');

// Базовая структура
const structure = [
  'api/input-dto/{{kebabCase name}}-query-params.input-dto.ts',
  'api/input-dto/create-{{singularize(kebabCase(name))}}.input-dto.ts',
  'api/input-dto/update-{{singularize(kebabCase(name))}}.input-dto.ts',
  'api/input-dto/{{kebabCase name}}-sort-by.ts',
  'api/view-dto/{{singularize(kebabCase(name))}}.view-dto.ts',
  'api/validation',
  'api/{{kebabCase name}}.controller.ts',
  'application/queries/get-{{singularize(kebabCase(name))}}-by-id.query-handler.ts',
  'application/queries/get-{{kebabCase name}}.query-handler.ts',
  'application/usecases/create-{{singularize(kebabCase(name))}}.usecase.ts',
  'application/usecases/delete-{{singularize(kebabCase(name))}}.usecase.ts',
  'application/usecases/update-{{singularize(kebabCase(name))}}.usecase.ts',
  'constants',
  'dto/{{singularize(kebabCase(name))}}.dto.ts',
  'domain/{{singularize(kebabCase(name))}}.entity.ts',
  'infrastructure/query/{{kebabCase name}}.query-repository.ts',
  'infrastructure/{{kebabCase name}}.repository.ts',
  '{{kebabCase name}}.module.ts',
];

// Заглушки классов
const fileTemplates = {
  'api/input-dto/create*.input-dto.ts': (
    name,
  ) => `import { IsString } from 'class-validator';

export class Create${toPascalCase(singularize(name))}InputDto {
  @IsString()
  name: string;
}`,
  'api/input-dto/update*.input-dto.ts': (
    name,
  ) => `import { PartialType } from '@nestjs/mapped-types';
  import { Create${toPascalCase(singularize(name))}InputDto } from './create-${singularize(kebabCase(name))}.input-dto';

export class Update${toPascalCase(singularize(name))}InputDto extends PartialType(Create${toPascalCase(singularize(name))}InputDto) {}`,
  'api/input-dto/*-query-params.input-dto.ts': (
    name,
  ) => `import { BaseSortablePaginationParams } from 'SPECIFY_IMPORT';
import { ${toPascalCase(name)}SortBy } from './${name}-sort-by';
import { IsEnum } from 'class-validator';
export class Get${toPascalCase(name)}QueryParams extends BaseSortablePaginationParams<${toPascalCase(name)}SortBy> {
  @IsEnum(${toPascalCase(name)}SortBy)
  sortBy = ${toPascalCase(name)}SortBy.CreatedAt;
}`,

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
    private readonly queryRepository: ${toPascalCase(name)}QueryRepository,
  ) {}

  async execute(query: Get${toPascalCase(singularize(name))}ByIdQuery): Promise<${toPascalCase(singularize(name))}ViewDto> {
    return this.queryRepository.getByIdOrNotFoundFail(query.id);
  }
}`,

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
    private readonly queryRepository: ${toPascalCase(name)}QueryRepository,
  ) {}

  async execute(query: Get${toPascalCase(name)}Query): Promise<PaginatedViewDto<${toPascalCase(singularize(name))}ViewDto[]>> {
    return this.queryRepository.getAll(query.queryParams);
  }
}`,

  'api/*.controller.ts': (
    name,
  ) => `import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { Create${toPascalCase(singularize(name))}Command } from '../application/usecases/create-${singularize(kebabCase(name))}.usecase';
import { Update${toPascalCase(singularize(name))}Command } from '../application/usecases/update-${singularize(kebabCase(name))}.usecase';
import { Delete${toPascalCase(singularize(name))}Command } from '../application/usecases/delete-${singularize(kebabCase(name))}.usecase';
import { Create${toPascalCase(singularize(name))}InputDto } from './input-dto/create-${singularize(kebabCase(name))}.input-dto';
import { Update${toPascalCase(singularize(name))}InputDto } from './input-dto/update-${singularize(kebabCase(name))}.input-dto';

@Controller('${kebabCase(name)}')
export class ${toPascalCase(name)}Controller {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: Create${toPascalCase(singularize(name))}InputDto) {
    return this.commandBus.execute(new Create${toPascalCase(singularize(name))}Command(dto));
  }

  @Put(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: Update${toPascalCase(singularize(name))}InputDto,
  ) {
    return this.commandBus.execute(new Update${toPascalCase(singularize(name))}Command(id, dto));
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.commandBus.execute(new Delete${toPascalCase(singularize(name))}Command(id));
  }
}`,
  'application/usecases/create-*.ts': (
    name,
  ) => `import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ${toPascalCase(singularize(name))}, ${toPascalCase(singularize(name))}ModelType } from '../../domain/${singularize(kebabCase(name))}.entity';
import { Create${toPascalCase(singularize(name))}Dto } from '../../dto/${singularize(kebabCase(name))}.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ${toPascalCase(name)}Repository } from '../../infrastructure/${kebabCase(name)}.repository';

export class Create${toPascalCase(singularize(name))}Command {
  constructor(public dto: Create${toPascalCase(singularize(name))}Dto) {}
}

@CommandHandler(Create${toPascalCase(singularize(name))}Command)
export class Create${toPascalCase(singularize(name))}UseCase
  implements ICommandHandler<Create${toPascalCase(singularize(name))}Command, Types.ObjectId>
{
  constructor(
    @InjectModel(${toPascalCase(singularize(name))}.name)
    private ${toCamelCase(name)}Model: ${toPascalCase(singularize(name))}ModelType,
    private ${toCamelCase(name)}Repository: ${toPascalCase(name)}Repository
  ) {}

  async execute({ dto }: Create${toPascalCase(singularize(name))}Command): Promise<Types.ObjectId> {
    const entity = this.${toCamelCase(name)}Model.createInstance(dto);

    await this.${toCamelCase(name)}Repository.save(entity);

    return entity._id;
  }
}`,
  'application/usecases/update-*.ts': (
    name,
  ) => `import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { Update${toPascalCase(singularize(name))}Dto } from '../../dto/${singularize(kebabCase(name))}.dto';
import { ${toPascalCase(name)}Repository } from '../../infrastructure/${kebabCase(name)}.repository';

export class Update${toPascalCase(singularize(name))}Command {
  constructor(public id: Types.ObjectId, public dto: Update${toPascalCase(singularize(name))}Dto) {}
}

@CommandHandler(Update${toPascalCase(singularize(name))}Command)
export class Update${toPascalCase(singularize(name))}UseCase
  implements ICommandHandler<Update${toPascalCase(singularize(name))}Command, void>
{
  constructor(private ${toCamelCase(name)}Repository: ${toPascalCase(name)}Repository) {}

  async execute({ id, dto }: Update${toPascalCase(singularize(name))}Command): Promise<void> {
    const entity = await this.${toCamelCase(name)}Repository.findOrNotFoundFail(id);

    entity.update(dto);

    await this.${toCamelCase(name)}Repository.save(entity);
  }
}`,
  'application/usecases/delete-*.ts': (
    name,
  ) => `import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { ${toPascalCase(name)}Repository } from '../../infrastructure/${kebabCase(name)}.repository';

export class Delete${toPascalCase(singularize(name))}Command {
  constructor(public id: Types.ObjectId) {}
}

@CommandHandler(Delete${toPascalCase(singularize(name))}Command)
export class Delete${toPascalCase(singularize(name))}UseCase
  implements ICommandHandler<Delete${toPascalCase(singularize(name))}Command, void>
{
  constructor(private ${toCamelCase(name)}Repository: ${toPascalCase(name)}Repository) {}

  async execute({ id }: Delete${toPascalCase(singularize(name))}Command): Promise<void> {
    const entity = await this.${toCamelCase(name)}Repository.findOrNotFoundFail(id);

    await this.${toCamelCase(name)}Repository.save(entity);
  }
}`,
  'dto/*.ts': (name) => `import { PartialType } from '@nestjs/mapped-types';

export class Create${toPascalCase(singularize(name))}Dto {
  name: string;
}

export class Update${toPascalCase(singularize(name))}Dto extends PartialType(Create${toPascalCase(singularize(name))}Dto) {}`,
  'domain/*.entity.ts': (
    name,
  ) => `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Create${toPascalCase(singularize(name))}Dto, Update${toPascalCase(singularize(name))}Dto } from '../dto/${singularize(kebabCase(name))}.dto';

@Schema({ timestamps: true })
export class ${toPascalCase(singularize(name))} {
  @Prop({ type: String })
  name: string;

  /**
   * Creation timestamp
   * Explicitly defined despite timestamps: true
   * properties without @Prop for typescript so that they are in the class instance (or in instance methods)
   * @type {Date}
   */
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: Create${toPascalCase(singularize(name))}Dto): ${toPascalCase(singularize(name))}Document {
    const instance = new this();
    instance.name = dto.name;
    return instance as ${toPascalCase(singularize(name))}Document;
  }

  update(dto: Update${toPascalCase(name)}Dto) {
    this.name = dto.name || this.name;
  }
}

export const ${toPascalCase(singularize(name))}Schema = SchemaFactory.createForClass(${toPascalCase(singularize(name))});
${toPascalCase(singularize(name))}Schema.loadClass(${toPascalCase(singularize(name))});

export type ${toPascalCase(singularize(name))}Document = HydratedDocument<${toPascalCase(singularize(name))}>;
export type ${toPascalCase(singularize(name))}ModelType = Model<${toPascalCase(singularize(name))}Document> & typeof ${toPascalCase(singularize(name))};`,
  'infrastructure/*.repository.ts': (
    name,
  ) => `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  ${toPascalCase(singularize(name))},
  ${toPascalCase(singularize(name))}ModelType,
  ${toPascalCase(singularize(name))}Document,
} from '../domain/${singularize(kebabCase(name))}.entity';

@Injectable()
export class ${toPascalCase(name)}Repository {
  constructor(@InjectModel(${toPascalCase(singularize(name))}.name) private ${toCamelCase(singularize(name))}Model: ${toPascalCase(singularize(name))}ModelType) {}

  async findById(id: Types.ObjectId): Promise<${toPascalCase(singularize(name))}Document | null> {
    return this.${toCamelCase(singularize(name))}Model.findOne({
      _id: id,
    });
  }

  async save(entity: ${toPascalCase(singularize(name))}Document) {
    await entity.save();
  }

  async findOrNotFoundFail(id: Types.ObjectId): Promise<${toPascalCase(singularize(name))}Document> {
    const entity = await this.findById(id);

    if (!entity) {
      //TODO: Replace with NotFoundDomainException
      throw new Error('${toPascalCase(name)} not found');
    }

    return entity;
  }
}`,
  'infrastructure/query/*.query-repository.ts': (
    name,
  ) => `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, FilterQuery } from 'mongoose';
import { ${toPascalCase(singularize(name))}, ${toPascalCase(singularize(name))}ModelType } from '../../domain/${singularize(kebabCase(name))}.entity';
import { ${toPascalCase(singularize(name))}ViewDto } from '../../api/view-dto/${singularize(kebabCase(name))}.view-dto';
import { PaginatedViewDto } from 'SPECIFY_IMPORT';
import { Get${toPascalCase(name)}QueryParams } from '../../api/input-dto/${kebabCase(name)}-query-params.input-dto';

@Injectable()
export class ${toPascalCase(name)}QueryRepository {
  constructor(@InjectModel(${toPascalCase(singularize(name))}.name) private ${toCamelCase(singularize(name))}Model: ${toPascalCase(singularize(name))}ModelType) {}

  async getByIdOrNotFoundFail(id: Types.ObjectId): Promise<${toPascalCase(singularize(name))}ViewDto> {
    const entity = await this.${toCamelCase(singularize(name))}Model.findOne({
      _id: id,
    });

    if (!entity) {
      throw new Error('${toPascalCase(name)} not found'); // TODO: Replace with domain exception if available
    }

    return ${toPascalCase(singularize(name))}ViewDto.mapToView(entity);
  }

  async getAll(
    query: Get${toPascalCase(name)}QueryParams,
  ): Promise<PaginatedViewDto<${toPascalCase(singularize(name))}ViewDto[]>> {
    const filter: FilterQuery<${toPascalCase(singularize(name))}> = {};

    const entities = await this.${toCamelCase(singularize(name))}Model.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.${toCamelCase(singularize(name))}Model.countDocuments(filter);

    const items = entities.map(${toPascalCase(singularize(name))}ViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}`,
};

// Создание файлов и директорий
function createFeature(name, baseDir = 'src/features') {
  const featureDir = path.join(baseDir, name);
  structure.forEach((relativePath) => {
    const processedPath = relativePath
      .replace(/\{\{kebabCase name\}\}/g, kebabCase(name))
      .replace(
        /\{\{singularize\(kebabCase\(name\)\)\}\}/g,
        singularize(kebabCase(name)),
      );
    const fullPath = path.join(featureDir, processedPath);
    const dirPath = path.dirname(fullPath);

    // Создаем директорию, если её нет
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Если это файл, создаем его с заглушкой
    if (path.extname(fullPath)) {
      const templateKey = Object.keys(fileTemplates).find((key) => {
        const pattern = new RegExp(key.replace('*', '[^/]+') + '$');
        return pattern.test(processedPath);
      });

      const fileName = path.basename(fullPath, path.extname(fullPath));
      const content = fileTemplates[templateKey]
        ? fileTemplates[templateKey](name)
        : '';

      fs.writeFileSync(fullPath, content);
    }
  });

  console.log(`Feature "${name}" created successfully in ${featureDir}`);
}

// Функции для преобразования имени
function toPascalCase(str) {
  return str
    .replace(/(^|[-_])([a-z])/g, (_, __, letter) => letter.toUpperCase())
    .replace(/[-_]/g, '');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function singularize(word) {
  if (word.endsWith('ies')) {
    return word.replace(/ies$/, 'y');
  }
  if (word.endsWith('s')) {
    return word.replace(/s$/, '');
  }
  return word;
}

// Генерация новой фичи
const featureName = process.argv[2]; // Имя фичи передается как аргумент командной строки
if (!featureName) {
  console.error('Please provide a feature name.');
  process.exit(1);
}

createFeature(featureName);
