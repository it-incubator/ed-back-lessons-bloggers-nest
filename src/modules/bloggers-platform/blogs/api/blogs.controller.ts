import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { CreateBlogInputDto } from './input-dto/create-blog.input-dto';
import { UpdateBlogInputDto } from './input-dto/update-blog.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetBlogsQuery } from '../application/queries/get-blogs.query-handler';
import { GetBlogsQueryParams } from './input-dto/blogs-query-params.input-dto';
import { BlogViewDto } from './view-dto/blog.view-dto';
import { GetBlogByIdQuery } from '../application/queries/get-blog-by-id.query-handler';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../../user-accounts/guards/decorators/param/extract-user-if-exists-from-request.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { ApiBasicAuth, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.queryBus.execute(new GetBlogsQuery(query));
  }

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  async getById(
    @Param('id') id: Types.ObjectId,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<BlogViewDto> {
    console.log('GET BLOG USER CONTEXT!!!', user);
    return this.queryBus.execute(new GetBlogByIdQuery(id, user?.id || null));
  }

  @ApiBasicAuth('basicAuth')
  @UseGuards(BasicAuthGuard)
  @Post()
  async create(@Body() dto: CreateBlogInputDto) {
    return this.commandBus.execute(new CreateBlogCommand(dto));
  }

  @ApiBasicAuth('basicAuth')
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: UpdateBlogInputDto,
  ) {
    return this.commandBus.execute(new UpdateBlogCommand(id, dto));
  }

  @ApiBasicAuth('basicAuth')
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }
}
