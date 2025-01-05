import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('AppController created');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
