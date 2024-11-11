import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IUserQueryRepository } from '../infrastructure/query/users.query-repository';
import { UserViewDto } from './view-dto/users.view-dto';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { ApiParam } from '@nestjs/swagger';
import { UpdateUserInputDto } from './input-dto/update-user-input.dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params';

import { USER_QUERY_REPO_TOKEN } from '../constants/users.inject-tokens';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';

@Controller('users')
export class UsersController {
  constructor(
    //инжектирование через токен
    @Inject(USER_QUERY_REPO_TOKEN)
    private usersQueryRepository: IUserQueryRepository<
      UserViewDto,
      GetUsersQueryParams
    >,
    //private usersService: UsersService,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiParam({ name: 'id' }) //для сваггера
  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(body),
    );

    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserInputDto,
  ): Promise<UserViewDto> {
    //TODO replace with commandBus
    //const userId = await this.usersService.updateUser(id, body);

    //return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @ApiParam({ name: 'id' }) //для сваггера
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  //ParseIntPipe может использоваться для трансформации строки в число, если id: number.
  // Можно так же использовать класс dto по аналогии с query и body
  async deleteUser(@Param('id' /*,ParseIntPipe*/) id: string): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
