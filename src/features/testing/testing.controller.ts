import { Controller, Delete } from '@nestjs/common';
import { User, UserModelType } from '../user-accounts/domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  @Delete('all-data')
  deleteAll() {
    this.UserModel.deleteMany();
  }
}
