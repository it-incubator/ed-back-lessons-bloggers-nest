import { Injectable } from '@nestjs/common';
import { IPaymentStrategy } from '@features/user-accounts/application/payment.strategy.interface';

@Injectable()
export class PaypalService extends IPaymentStrategy {
  constructor() {
    super();
    console.log('PaypalService created');
  }

  makePayment(orderId: number, amount: number) {
    console.log(`Paid by paypal: ${orderId} ;${amount}`);
    return 'urltopaypal';
  }
}
