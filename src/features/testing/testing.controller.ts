import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { User, UserModelType } from '../user-accounts/domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAll() {
    return this.UserModel.deleteMany();
  }
}
