import { PartialType } from '@nestjs/mapped-types';
import { AgeRestriction } from '../domain/blog.entity';

export class CreateBlogDto {
  name: string;
  ageRestriction: AgeRestriction;
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
