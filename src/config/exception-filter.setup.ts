import { INestApplication } from '@nestjs/common';
import {
  AllExceptionsFilter,
  DomainExceptionsFilter,
} from '../core/exceptions/exception-filters';

export function exceptionFilterSetup(app: INestApplication) {
  //Подключаем наши фильтры. Тут важна последовательность! (сработает справа на лево)
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionsFilter());
}
