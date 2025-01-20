const {
  kebabCase,
  singularize,
  toCamelCase,
  toPascalCase,
} = require('../utils');

const domain = {
  'dto/*.ts': (name) => `import { PartialType } from '@nestjs/mapped-types';

export class Create${toPascalCase(singularize(name))}Dto {
  name: string;
}

export class Update${toPascalCase(singularize(name))}Dto extends PartialType(Create${toPascalCase(singularize(name))}Dto) {}`,
  //----------------
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

  update(dto: Update${toPascalCase(singularize(name))}Dto) {
    this.name = dto.name || this.name;
  }
}

export const ${toPascalCase(singularize(name))}Schema = SchemaFactory.createForClass(${toPascalCase(singularize(name))});
${toPascalCase(singularize(name))}Schema.loadClass(${toPascalCase(singularize(name))});

export type ${toPascalCase(singularize(name))}Document = HydratedDocument<${toPascalCase(singularize(name))}>;
export type ${toPascalCase(singularize(name))}ModelType = Model<${toPascalCase(singularize(name))}Document> & typeof ${toPascalCase(singularize(name))};
`,
};

module.exports = domain;
