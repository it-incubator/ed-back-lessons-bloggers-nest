import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { User } from '../../../domain/user.entity';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UsersFactory } from '../../factories/users.factory';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

/**
 * Создание администратором пользователя через админскую панель
 */
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, Types.ObjectId>
{
  constructor(
    @InjectModel(User.name)
    private usersRepository: UsersRepository,
    private usersFactory: UsersFactory,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<Types.ObjectId> {
    const user = await this.usersFactory.create(dto);

    user.isEmailConfirmed = true;
    await this.usersRepository.save(user);

    return user._id;
  }
}
