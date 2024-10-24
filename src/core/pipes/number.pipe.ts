import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

// Custom pipe example
// https://docs.nestjs.com/pipes#custom-pipes
@Injectable()
export class NumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const num = Number(value);

    if (isNaN(num)) {
      throw new BadRequestException('Not a number');
    }

    return num;
  }
}
