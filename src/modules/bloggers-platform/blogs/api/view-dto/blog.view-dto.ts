import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewDto {
  id: string;
  name: string;

  static mapToView(Blog: BlogDocument): BlogViewDto {
    const dto = new BlogViewDto();
    dto.id = Blog._id.toString();
    dto.name = Blog.name;

    return dto;
  }
}
