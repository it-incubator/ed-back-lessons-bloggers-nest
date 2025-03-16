import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';

import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Nullable, UserContextDto } from '../guards/dto/user-context.dto';
import { MeViewDto } from './view-dto/users.view-dto';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { RegisterUserCommand } from '../application/usecases/users/register-user.usecase';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { LoginUserCommand } from '../application/usecases/login-user.usecase';
import { JwtOptionalAuthGuard } from '../guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../guards/decorators/param/extract-user-if-exists-from-request.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private authQueryRepository: AuthQueryRepository,
  ) {}
  @Post('registration')
  registration(@Body() body: CreateUserInputDto) {
    return this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  //swagger doc
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        login: { type: 'string', example: 'string' },
        password: { type: 'string', example: 'string' },
      },
    },
  })
  login(
    /*@Request() req: any*/
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<{ accessToken: string }> {
    return this.commandBus.execute(new LoginUserCommand({ userId: user.id }));
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @ApiBearerAuth()
  @Get('me-or-default')
  @UseGuards(JwtOptionalAuthGuard)
  async meOrDefault(
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<Nullable<MeViewDto>> {
    if (user) {
      return this.authQueryRepository.me(user.id!);
    } else {
      return {
        login: 'anonymous',
        userId: null,
        email: null,
        firstName: null,
        lastName: null,
        age: null,
      };
    }
  }
}
