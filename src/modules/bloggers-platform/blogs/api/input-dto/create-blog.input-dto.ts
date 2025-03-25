import { IsEnum, IsString } from 'class-validator';
import { AgeRestriction } from '../../domain/blog.entity';
import { CreateBlogDto } from '../../dto/blog.dto';

export class CreateBlogInputDto implements CreateBlogDto {
  @IsString()
  name: string;

  @IsEnum(AgeRestriction)
  ageRestriction: AgeRestriction;
}
