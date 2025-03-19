import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum } from 'class-validator';
import { BaseQueryParams } from '@core/dto/base.query-params.input-dto';

export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;
}
