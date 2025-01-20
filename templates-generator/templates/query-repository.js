const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('../utils');

const queryRepository = {
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

module.exports = queryRepository;
