import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;
}
