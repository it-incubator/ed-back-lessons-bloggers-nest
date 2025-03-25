import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../user-accounts/domain/events/user-registered.event';
import { EmailService } from '../email.service';

// https://docs.nestjs.com/recipes/cqrs#events
@EventsHandler(UserRegisteredEvent)
export class SendConfirmationEmailWhenUserRegisteredEventHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(private emailService: EmailService) {}

  async handle(event: UserRegisteredEvent) {
    // Ошибки в EventHandlers не могут быть пойманы фильтрами исключений:
    // необходимо обрабатывать вручную
    try {
      // send sms
    } catch (e) {
      console.error('send sms', e);
    }
  }
}
