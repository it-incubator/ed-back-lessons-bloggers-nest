import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CreateUserCommand } from './create-user.usecase';
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { UsersRepository } from '../../infrastructure/users.repository';

export class RegisterUserCommand {
  constructor(public dto: CreateUserDto) {}
}

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
      string
    >(new CreateUserCommand(dto));

    const confirmCode = 'uuid';

    const user = await this.usersRepository.findOrNotFoundFail(createdUserId);

    user.setConfirmationCode(confirmCode);
    await this.usersRepository.save(user);

    this.eventBus.publish(new UserRegisteredEvent(user.email, confirmCode));
  }
}
