import { ITokenStrategy } from './auth-token.context';
import { UserContext } from '../../../../core/dto/user-context';

/**
 * for example, some token
 */
export class AuthFriendTokenStrategy implements ITokenStrategy<UserContext> {
  sign(payload: { id: string }): string {
    return `uuid/${payload.id}`;
  }
}
