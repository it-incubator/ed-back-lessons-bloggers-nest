import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../../dto/user-context';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContext => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new Error('there is no user in the request object!');
    }

    return user;
  },
);
