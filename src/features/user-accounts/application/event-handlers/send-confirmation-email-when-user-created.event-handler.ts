import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

// https://docs.nestjs.com/recipes/cqrs#events
@EventsHandler(UserCreatedEvent)
export class SendConfirmationEmailWhenUserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor() {}

  handle(event: UserCreatedEvent) {
    // Ошибки в EventHandlers не могут быть пойманы фильтрами исключений:
    // необходимо обрабатывать вручную
    try {
      // do logic
      console.log(`send email to ${event.email}`);
    } catch (e) {
      console.error(e);
    }
  }
}
