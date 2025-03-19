//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
import { UsersSortBy } from './users-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

//наследуемся от класса BaseQueryParams, где уже есть pageNumber, pageSize и т.п., чтобы не дублировать эти свойства
export class GetUsersQueryParams extends BaseQueryParams {
  sortBy = UsersSortBy.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
