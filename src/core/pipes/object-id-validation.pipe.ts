import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    // Проверяем, что тип данных в декораторе — ObjectId
    if (metadata.metatype === Types.ObjectId) {
      if (!isValidObjectId(value)) {
        throw new BadRequestException(`Invalid ObjectId: ${value}`);
      }
      return new Types.ObjectId(value); // Преобразуем строку в ObjectId
    }

    // Если тип не ObjectId, возвращаем значение без изменений
    return value;
  }
}
