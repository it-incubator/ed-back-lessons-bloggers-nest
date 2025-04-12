import { CreateUserDto } from '../../dto/create-user.dto';
import { CryptoService } from '../services/crypto.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../domain/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersFactory {
  // ❌ passwordHash: string; ни в коем случае не шарим состояние между методов через св-ва объекта (сервиса, юзкейса, квери, репозитория)
  // потому что синглтон, между разными запросами может быть перезапись данных

  constructor(
    private readonly cryptoService: CryptoService,
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}
  async create(dto: CreateUserDto): Promise<UserDocument> {
    const passwordHash = await this.createPasswordHash(dto);
    const user = this.createUserInstance(dto, passwordHash);

    return user;
  }

  private async createPasswordHash(dto: CreateUserDto) {
    const passwordHash = await this.cryptoService.createPasswordHash(
      dto.password,
    );
    return passwordHash;
  }

  private createUserInstance(dto: CreateUserDto, passwordHash: string) {
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
      age: dto.age,
    });
    return user;
  }
}
