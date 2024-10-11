import { CreateUserDto } from '../../dto/create-user.dto';
import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';

//dto для боди при создании юзера. Сода могут быть добавлены декораторы swagger
export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  sortBy = UsersSortBy.CreatedAt;
  searchLoginTerm: string | null = null;
  searchEmailTerm: string | null = null;
}
