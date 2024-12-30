import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContextDto } from '../../../features/user-accounts/guards/user-context-dto';

export const ExtractUserIfExistsFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContextDto | null => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return null;
    }

    return user;
  },
);