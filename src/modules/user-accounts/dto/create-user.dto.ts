export class CreateUserDto {
  login: string;
  email: string;
  password: string;
  age: number;
}

export class UpdateUserDto {
  email: string;
}
