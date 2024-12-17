import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { User, UserModelType } from '../../domain/user.entity';
import { UpdateUserDto } from '../../dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class UpdateUserCommand {
  constructor(
    public id: Types.ObjectId,
    public dto: UpdateUserDto,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<UpdateUserCommand, void>
{
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<void> {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.update(dto);

    await this.usersRepository.save(user);
  }
}
