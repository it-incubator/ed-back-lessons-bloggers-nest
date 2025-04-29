import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UsersRepository } from '../../../infrastructure/users.repository';
import { UserRegisteredEvent } from '../../../domain/events/user-registered.event';
import { UsersFactory } from '../../factories/users.factory';

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
    private eventBus: EventBus,
    private usersRepository: UsersRepository,
    private usersFactory: UsersFactory,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    try {
      const user = await this.usersFactory.create(dto);
      const confirmCode = 'uuid';
      user.setConfirmationCode(confirmCode);
      // ивенты могут возвращаться из метода сущности
      //const events = user.setConfirmationCode(confirmCode);
      await this.usersRepository.save(user);

      this.eventBus.publish(new UserRegisteredEvent(user.email, confirmCode));
      // а могут просто накапливаться в сущности и в конце мы можем у неё
      // попросить данные ивенты, чтиобы опубликовать их
      // this.eventBus.publish(user.getEvents());
    } catch {
      // transaction.rollback();
    }
  }
}
