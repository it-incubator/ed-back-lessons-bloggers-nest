import { InjectModel } from '@nestjs/mongoose';
import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

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
      throw NotFoundDomainException.create('user not found');
    }

    if (user.deletionStatus === DeletionStatus.PermanentDeleted) {
      console.log('user ' + user._id.toString() + ' was deleted');

      throw NotFoundDomainException.create('user not found');
    }

    return user;
  }

  async loginIsExist(login: string): Promise<boolean> {
    return !!(await this.UserModel.countDocuments({ login: login }));
  }
}
