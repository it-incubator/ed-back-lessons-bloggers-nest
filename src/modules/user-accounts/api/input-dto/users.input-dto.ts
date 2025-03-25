//dto для боди при создании юзера. Сюда могут быть добавлены декораторы swagger
export class CreateUserInputDto {
  login: string;
  password: string;
  email: string;
}
