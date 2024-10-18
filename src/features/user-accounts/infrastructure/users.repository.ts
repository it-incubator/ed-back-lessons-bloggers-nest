import { InjectModel } from '@nestjs/mongoose';
import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  //инжектирование модели через DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async findNonDeletedOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      //TODO: replace with domain exception
      throw new NotFoundException('user not found');
    }

    if (user.deletionStatus === DeletionStatus.PermanentDeleted) {
      console.log('user ' + user._id.toString() + ' was deleted');
      //TODO: replace with domain exception
      throw new NotFoundException('user not found');
    }

    return user;
  }
}