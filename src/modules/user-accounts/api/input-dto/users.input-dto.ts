import { IsEmail, IsString, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import {
  loginConstraints,
  passwordConstraints,
} from '../../domain/user.entity';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';

// Доступные декораторы для валидации
// https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto {
  @IsStringWithTrim(loginConstraints.minLength, loginConstraints.maxLength)
  login: string;

  @IsString()
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @Trim()
  password: string;

  @IsString()
  @IsEmail()
  // @Matches(emailConstraints.match)
  @Trim()
  email: string;
}
