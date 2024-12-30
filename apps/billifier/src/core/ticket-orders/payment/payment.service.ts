import { Injectable } from '@nestjs/common';
import { IPaymentAdapter } from './adapters/payment.adapter.interface';
import { KkiapayAdapter } from './adapters/kkiapay.adapter';
import { PaymentAdapter } from './payment.module';
import { ConfigService } from '@nestjs/config';
import { MetaData } from './dto';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}
  async getAdapter(provider: PaymentAdapter): Promise<IPaymentAdapter> {
    switch (provider) {
      case PaymentAdapter.KKIAPAY:
        return new KkiapayAdapter(
          this.configService.get('KKIAPAY_PUBLIC_KEY'),
          this.configService.get('KKIAPAY_SECRET_KEY'),
          this.configService.get('KKIAPAY_PRIVATE_KEY'),
        );
      // case 'stripe':
      //   return new StripeAdapter('YOUR_STRIPE_API_KEY', 'YOUR_STRIPE_SECRET');
      default:
        throw new Error(`Unsupported payment provider: ${provider}`);
    }
  }

  async pay(
    provider: PaymentAdapter,
    amount: number,
    metadata?: MetaData,
  ): Promise<string> {
    const adapter = await this.getAdapter(provider);
    return adapter.makePayment(amount, metadata);
  }

  async checkStatus(
    provider: PaymentAdapter,
    transactionId: string,
  ): Promise<string> {
    const adapter = await this.getAdapter(provider);
    return adapter.checkTransactionStatus(transactionId);
  }

  async cancel(provider: PaymentAdapter, transactionId: string): Promise<any> {
    const adapter = await this.getAdapter(provider);
    return adapter.cancelTransaction(transactionId);
  }
}
