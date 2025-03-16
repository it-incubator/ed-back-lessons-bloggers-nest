import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { Types } from 'mongoose';
import { CreateUserCommand } from '../admins/create-user.usecase';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserRegisteredEvent } from '../../../domain/events/user-registered.event';

export class RegisterUserCommand {
  constructor(public dto: CreateUserDto) {}
}

/**
 * Регистрация пользователя через email на странице регистрации сайта
 */
@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private commandBus: CommandBus,
    private eventBus: EventBus,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    const createdUserId = await this.commandBus.execute<
      CreateUserCommand,
      Types.ObjectId
    >(new CreateUserCommand(dto));

    const confirmCode = 'uuid';

    const user = await this.usersRepository.findOrNotFoundFail(createdUserId);

    user.setConfirmationCode(confirmCode);
    await this.usersRepository.save(user);

    this.eventBus.publish(new UserRegisteredEvent(user.email, confirmCode));
    return;
  }
}
