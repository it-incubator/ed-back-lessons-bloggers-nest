import { INestApplication } from '@nestjs/common';
import { AllHttpExceptionsFilter } from '../core/exceptions/filters/all-exceptions-filter';
import { DomainHttpExceptionsFilter } from '../core/exceptions/filters/domain-exceptions-filter';

export function exceptionFilterSetup(app: INestApplication) {
  //Подключаем наши фильтры. Тут важна последовательность! (сработает справа на лево)
  app.useGlobalFilters(
    new AllHttpExceptionsFilter(),
    new DomainHttpExceptionsFilter(),
  );
}
