import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Blog, BlogModelType, BlogDocument } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}

  async findById(id: Types.ObjectId): Promise<BlogDocument | null> {
    return this.blogModel.findOne({
      _id: id,
    });
  }

  async save(entity: BlogDocument) {
    await entity.save();
  }

  async findOrNotFoundFail(id: Types.ObjectId): Promise<BlogDocument> {
    const entity = await this.findById(id);

    if (!entity) {
      //TODO: Replace with NotFoundDomainException
      throw new Error('Blogs not found');
    }

    return entity;
  }
}
