import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}
  async validateUser(login: string, password: string): Promise<UserContextDto> {
    const user = await this.usersRepository.findByLogin(login);
    if (!user) {
      throw UnauthorizedDomainException.create();
    }

    const isPasswordValid = await this.cryptoService.comparePasswords({
      password,
      hash: user.passwordHash,
    });

    if (isPasswordValid) {
      return { id: user.id };
    }

    throw UnauthorizedDomainException.create();
  }
}
