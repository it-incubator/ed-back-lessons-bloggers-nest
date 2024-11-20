import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { ExtractUserFromRequest } from '../../../core/decorators/param/extract-user-from-request';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserContext } from '../../../core/dto/user-context';
import { MeViewDto } from './view-dto/users.view-dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { RegisterUserCommand } from '../application/usecases/register-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}
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
        login: { type: 'string', example: 'login123' },
        password: { type: 'string', example: 'superpassword' },
      },
    },
  })
  login(
    /*@Request() req: any*/
    @ExtractUserFromRequest() user: UserContext,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(user.id);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContext): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }
}
