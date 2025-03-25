import { Injectable, Scope } from '@nestjs/common';
import { CounterRepository } from '../infrastructure/counter.repository';
import { LoggerService } from './logger.service';

@Injectable({ scope: Scope.DEFAULT })
export class Counter2Service {
  constructor(
    private counterRepository: CounterRepository,
    //private logger: LoggerService,
  ) {
    //this.logger.setContext(Counter2Service.name);
    console.log('Counter2Service creating');
  }

  async getCountAndIncrement() {
    //this.logger.log('message in getCountAndIncrement method');

    this.counterRepository.increment();
    return this.counterRepository.getCount();
  }
}
