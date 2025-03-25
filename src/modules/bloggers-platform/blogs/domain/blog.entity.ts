import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.dto';
export enum AgeRestriction {
  None = 'none',
  Age18Plus = '18+',
}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String })
  name: string;

  @Prop({ enum: AgeRestriction })
  ageRestriction: AgeRestriction;

  /**
   * Creation timestamp
   * Explicitly defined despite timestamps: true
   * properties without @Prop for typescript so that they are in the class instance (or in instance methods)
   * @type {Date}
   */
  createdAt: Date;
  updatedAt: Date;

  static createInstance(dto: CreateBlogDto): BlogDocument {
    const instance = new this();
    instance.name = dto.name;
    instance.ageRestriction = dto.ageRestriction;
    return instance as BlogDocument;
  }

  update(dto: UpdateBlogDto) {
    this.name = dto.name || this.name;
    this.ageRestriction = dto.ageRestriction || this.ageRestriction;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;
export type BlogModelType = Model<BlogDocument> & typeof Blog;
