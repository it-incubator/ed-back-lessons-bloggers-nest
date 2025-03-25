import { Injectable } from '@nestjs/common';
import { IPaymentStrategy } from '@src/modules/user-accounts/application/payment.strategy.interface';

@Injectable()
export class StripeService extends IPaymentStrategy {
  constructor() {
    super();
    console.log('StripeService created');
  }

  makePayment(orderId: number, amount: number) {
    console.log(`Paid by stripe: ${orderId} ;${amount}`);
    return 'urltopayStripe';
  }
}
