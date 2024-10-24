import { CreateUserDto } from '../../dto/create-user.dto';
import { BaseSortablePaginationParams } from '../../../../core/dto/base.query-params.input-dto';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';
import { IsTrimmedString } from '../../../../core/decorators/validation/is-trimmed-string';
import { LoginIsExist } from '../validation/login-is-exist.decorator';

// Доступные декораторы для валидации
// https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto implements CreateUserDto {
  @IsTrimmedString(loginConstraints.minLength, loginConstraints.maxLength)
  @LoginIsExist()
  login: string;

  @IsString()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @Trim()
  password: string;

  @IsString()
  @IsEmail()
  //@Matches(emailConstraints.match)
  @Trim()
  email: string;
}

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

//dto для запроса списка юзеров с пагинацией, сортировкой, фильтрами
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
