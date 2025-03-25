export abstract class IPaymentStrategy {
  abstract makePayment(orderId: number, amount: number): string;
}
