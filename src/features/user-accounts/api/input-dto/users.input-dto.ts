import { CreateUserDto } from '../../dto/create-user.dto';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
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
