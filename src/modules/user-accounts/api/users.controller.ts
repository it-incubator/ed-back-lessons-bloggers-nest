import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { UserViewDto } from './view-dto/users.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view-dto';
import { ApiBasicAuth, ApiParam } from '@nestjs/swagger';
import { UpdateUserInputDto } from './input-dto/update-user.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { Types } from 'mongoose';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';
import { UpdateUserCommand } from '../application/usecases/update-user.usecase';
import { Public } from '../guards/decorators/public.decorator';
import { IPaymentStrategy } from '@src/modules/user-accounts/application/payment.strategy.interface';

@Controller({
  path: 'users',
  scope: Scope.DEFAULT,
})
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly paymentStrategy: IPaymentStrategy,
  ) {
    console.log('UsersController created');
  }

  @ApiParam({ name: 'id' }) //для сваггера
  @Get(':id')
  async getById(@Param('id') id: Types.ObjectId): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Public()
  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute<
      CreateUserCommand,
      Types.ObjectId
    >(new CreateUserCommand(body));

    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Put(':id')
  async updateUser(
    @Param('id') id: Types.ObjectId,
    @Body() body: UpdateUserInputDto,
  ): Promise<UserViewDto> {
    await this.commandBus.execute<UpdateUserCommand, void>(
      new UpdateUserCommand(id, body),
    );

    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }

  @ApiParam({ name: 'id' }) //для сваггера
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: Types.ObjectId): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }

  // @ApiParam({ name: 'orderId' }) //для сваггера
  // @Post('payment/:orderId')
  // //@HttpCode(HttpStatus.NO_CONTENT)
  // @Public()
  // async makePayment(
  //   @Param('orderId') orderId: number,
  //   @Query('paymentSystemType') paymentSystemType: 'stripe' | 'paypal',
  // ): Promise<{ url: string }> {
  //   return { url: this.paymentStrategy.makePayment(orderId, 100) };
  //   // switch (paymentSystemType) {
  //   //   case 'stripe':
  //   //     return { url: this.stripeService.makePayment(orderId, 100) };
  //   //   case 'paypal':
  //   //     return { url: this.paypalService.makePayment(orderId, 100) };
  //   // }
  // }
}
