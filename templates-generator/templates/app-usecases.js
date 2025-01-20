const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('../utils');

const usecases = {
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

  //-------------

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

  //--------

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
};

module.exports = usecases;
