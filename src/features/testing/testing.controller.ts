import { Controller, Delete } from '@nestjs/common';
import { User, UserModelType } from '../users/domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  @Delete()
  deleteAll() {
    this.UserModel.deleteMany();
  }
}
