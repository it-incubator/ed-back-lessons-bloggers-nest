import { CreateUserDto } from '../../dto/create-user.dto';

//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}
