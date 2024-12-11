import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../config/config-validation.utility';

@Injectable()
export class UserAccountConfig {
  @IsNotEmpty({
    message:
      'Set Env variable PAYMENT_PAYPAL_SECRET, you can take it in Paypal Shop Control Panel',
  })
  paypalSecret: string = this.configService.get('PAYMENT_PAYPAL_SECRET');

  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }
}
