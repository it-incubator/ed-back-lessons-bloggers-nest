import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blog, BlogModelType } from '../../domain/blog.entity';
import { CreateBlogDto } from '../../dto/blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, Types.ObjectId>
{
  constructor(
    @InjectModel(Blog.name)
    private blogsModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreateBlogCommand): Promise<Types.ObjectId> {
    const entity = this.blogsModel.createInstance(dto);

    await this.blogsRepository.save(entity);

    return entity._id;
  }
}
