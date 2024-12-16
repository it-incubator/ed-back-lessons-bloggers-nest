import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class IdInputDTO {
  @IsMongoId()
  id: Types.ObjectId;
}
