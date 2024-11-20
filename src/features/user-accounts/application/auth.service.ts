import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';
import { JwtService } from '@nestjs/jwt';
import { UserContext } from '../../../core/dto/user-context';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}
  async validateUser(login: string, password: string): Promise<UserContext> {
    const user = await this.usersRepository.findByLogin(login);
    if (!user) {
      throw UnauthorizedDomainException.create();
    }

    const isPasswordValid = await this.cryptoService.comparePasswords({
      password,
      hash: user.passwordHash,
    });

    if (isPasswordValid) {
      return { id: user.id.toString() };
    }

    throw UnauthorizedDomainException.create();
  }
}
