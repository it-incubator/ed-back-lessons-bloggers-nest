import { User, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserExternalDto } from './external-dto/users.external-dto';
import { Types } from 'mongoose';

@Injectable()
export class UsersExternalQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(id: Types.ObjectId): Promise<UserExternalDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return UserExternalDto.mapToView(user);
  }
}
