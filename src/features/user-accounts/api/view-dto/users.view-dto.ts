import { UserDocument } from '../../domain/user.entity';
import { OmitType } from '@nestjs/swagger';

export class UserViewDto {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;

  static mapToView(user: UserDocument): UserViewDto {
    const dto = new UserViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.id = user._id.toString();
    dto.createdAt = user.createdAt;
    dto.firstName = user.name.firstName;
    dto.lastName = user.name.lastName;

    return dto;
  }
}

//https://docs.nestjs.com/openapi/mapped-types
export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  userId: string;

  static mapToView(user: UserDocument): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user._id.toString();

    return dto;
  }
}
