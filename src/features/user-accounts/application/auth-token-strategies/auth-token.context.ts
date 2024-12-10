import { UserContext } from '../../../../core/dto/user-context';

//можно использовать interface
export abstract class ITokenStrategy<T extends UserContext> {
  abstract sign(payload: T): string;
}

export class AuthTokenContext<T extends UserContext> {
  constructor(private strategy: ITokenStrategy<T>) {}

  executeTokenSign(payload: T) {
    return this.strategy.sign(payload);
  }
}
