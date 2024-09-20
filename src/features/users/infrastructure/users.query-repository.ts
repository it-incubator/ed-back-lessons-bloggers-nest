import { DeletionStatus, User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserViewDto } from '../api/view-dto/user.view-dto';
import { NotFoundException } from '@nestjs/common';

export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return UserViewDto.mapToView(user);
  }

  //TODO: add pagination and filters
  async getAll(): Promise<UserViewDto[]> {
    const result = await this.UserModel.find().exec();

    return result.map((user) => UserViewDto.mapToView(user));
  }
}
