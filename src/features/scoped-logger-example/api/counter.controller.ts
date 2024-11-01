import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Scope } from '@nestjs/common';
import { CounterService } from '../application/counter.service';
import { Counter2Service } from '../application/counter2.service';
import { LoggerService } from '../application/logger.service';

@ApiTags('Counter')
@Controller({ path: 'counters', scope: Scope.DEFAULT })
export class CounterController {
  constructor(
    private counterService: CounterService,
    private counter2Service: Counter2Service,
    //private logger: LoggerService,
  ) {
    //this.logger.setContext(CounterController.name);
    console.log('CounterController creating');
  }

  @Get()
  async request() {
    //this.logger.log(`message in Get() method`);
    const count = await this.counterService.getCountAndIncrement();
    //await this.counter2Service.getCountAndIncrement();
    return {
      num: count,
    };
  }
}
