import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogInputDto } from './create-blog.input-dto';

export class UpdateBlogInputDto extends PartialType(CreateBlogInputDto) {}
