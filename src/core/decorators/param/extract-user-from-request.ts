import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContextDto } from '../../../features/user-accounts/guards/user-context-dto';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContextDto | null => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new Error('there is no user in the request object!');
    }

    return user;
  },
);
