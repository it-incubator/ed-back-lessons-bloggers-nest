//базовый класс для query параметров с пагинацией
//значения по-умолчанию применятся автоматически при настройке глобального ValidationPipe в main.ts
import { IsNumber } from 'class-validator';

class PaginationParams {
  //валидирует данные и при включенной
  // настройке enableImplicitConversion: true
  // в глобальном пайпе, преобразует в number
  @IsNumber()
  pageNumber: number = 1;
  @IsNumber()
  pageSize: number = 10;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

//базовый класс для query параметров с сортировкой и пагинацией
//поле sortBy должно быть реализовано в наследниках
export abstract class BaseSortablePaginationParams<T> extends PaginationParams {
  sortDirection: SortDirection = SortDirection.Desc;
  abstract sortBy: T;
}
