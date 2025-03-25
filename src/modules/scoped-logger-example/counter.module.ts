import { Module } from '@nestjs/common';
import { CounterService } from './application/counter.service';
import { Counter2Service } from './application/counter2.service';
import { CounterRepository } from './infrastructure/counter.repository';
import { LoggerService } from './application/logger.service';
import { CounterController } from './api/counter.controller';

@Module({
  controllers: [CounterController],
  providers: [
    CounterService,
    Counter2Service,
    CounterRepository,
    //LoggerService,
  ],
})
export class CounterModule {}
