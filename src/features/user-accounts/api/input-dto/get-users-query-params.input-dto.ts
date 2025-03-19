//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { UsersSortBy } from './users-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetUsersQueryParams extends BaseQueryParams {
  @IsEnum(UsersSortBy)
  sortBy = UsersSortBy.CreatedAt;
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
