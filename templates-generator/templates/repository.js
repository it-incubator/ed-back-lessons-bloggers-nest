const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('../utils');

const repository = {
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
};

module.exports = repository;
