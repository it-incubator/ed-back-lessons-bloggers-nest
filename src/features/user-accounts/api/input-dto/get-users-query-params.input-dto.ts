//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';
import { UsersSortBy } from './users-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  @IsEnum(UsersSortBy)
  sortBy = UsersSortBy.CreatedAt;
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
