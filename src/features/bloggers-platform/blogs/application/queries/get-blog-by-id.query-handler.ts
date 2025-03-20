import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure/query/blogs.query-repository';
import { BlogViewDto } from '../../api/view-dto/blog.view-dto';
import { Types } from 'mongoose';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { AgeRestriction } from '../../domain/blog.entity';
import { DomainException } from '@core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '@core/exceptions/domain-exception-codes';
import { UsersExternalQueryRepository } from '@src/features/user-accounts/infrastructure/external-query/users.external-query-repository';

export class GetBlogByIdQuery {
  constructor(
    public id: Types.ObjectId,
    public userId: Types.ObjectId | null,
  ) {}
}

@QueryHandler(GetBlogByIdQuery)
export class GetBlogByIdQueryHandler
  implements IQueryHandler<GetBlogByIdQuery, BlogViewDto>
{
  constructor(
    @Inject(BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly usersQueryRepository: UsersExternalQueryRepository,
  ) {}

  async execute(query: GetBlogByIdQuery): Promise<BlogViewDto> {
    const blog = await this.blogsRepository.findOrNotFoundFail(query.id);
    if (blog.ageRestriction === AgeRestriction.Age18Plus) {
      if (!query.userId) {
        throw new DomainException({
          code: DomainExceptionCode.Forbidden,
          message: 'Too yang',
        });
      }

      //The user's age can be contained in the token
      const user = await this.usersQueryRepository.getByIdOrNotFoundFail(
        query.userId,
      );

      if (user.age < 18) {
        throw new DomainException({
          code: DomainExceptionCode.Forbidden,
          message: 'Too yang',
        });
      }
    }

    return this.blogsQueryRepository.getByIdOrNotFoundFail(query.id);
  }
}
