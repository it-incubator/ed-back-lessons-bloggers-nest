import { Injectable, Scope } from '@nestjs/common';
import { LoggerService } from '../application/logger.service';

@Injectable({
  scope: Scope.DEFAULT,
})
export class CounterRepository {
  count = 0;

  constructor(/*private logger: LoggerService*/) {
    //this.logger.setContext(CounterRepository.name);
    console.log('CounterRepository creating');
  }

  increment() {
    this.count++;
  }

  getCount() {
    //this.logger.log('message in getCount method');
    return this.count;
  }
}
