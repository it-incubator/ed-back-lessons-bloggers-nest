import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  User,
  UserModelType,
} from 'src/modules/user-accounts/domain/user.entity';
import { CreateUserDto } from 'src/modules/user-accounts/dto/create-user.dto';
import { UsersRepository } from 'src/modules/user-accounts/infrastructure/users.repository';
import { CryptoService } from '../../crypto.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

/**
 * Создание администратором пользователя через админскую панель
 */
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, Types.ObjectId>
{
  // ❌ passwordHash: string; ни в коем случае не шарим состояние между методов через св-ва объекта (сервиса, юзкейса, квери, репозитория)
  // потому что синглтон, между разными запросами может быть перезапись данных

  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<Types.ObjectId> {
    const passwordHash = await this.createPasswordHash(dto);
    const user = this.createUserInstance(dto, passwordHash);
    await this.usersRepository.save(user);
    console.log(passwordHash);
    return user._id;
  }

  async createPasswordHash(dto: CreateUserDto) {
    const passwordHash = await this.cryptoService.createPasswordHash(
      dto.password,
    );
    return passwordHash;
  }

  createUserInstance(dto: CreateUserDto, passwordHash: string) {
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
      age: dto.age,
    });
    return user;
  }
}
