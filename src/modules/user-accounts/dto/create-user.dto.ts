export class CreateUserDto {
  login: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  email: string;
}

//              DTO4/ws/presentation
// fronttender - DTO3/presentation - DTO2/application - DTO1/repository
// fronttender - DTO1/presentation - DTO1/application - DTO1/repository
