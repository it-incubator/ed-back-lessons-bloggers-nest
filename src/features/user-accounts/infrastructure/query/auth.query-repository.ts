import { Injectable } from '@nestjs/common';
import { MeViewDto } from '../../api/view-dto/users.view-dto';
import { UsersRepository } from '../users.repository';
import { Types } from 'mongoose';

@Injectable()
export class AuthQueryRepository {
  constructor(private usersRepository: UsersRepository) {}

  async me(userId: string): Promise<MeViewDto> {
    const user = await this.usersRepository.findOrNotFoundFail(
      new Types.ObjectId(userId),
    );

    return MeViewDto.mapToView(user);
  }
}
