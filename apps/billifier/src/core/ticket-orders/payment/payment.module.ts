import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { HttpModule } from '@nestjs/axios';

export enum PaymentAdapter {
  KKIAPAY = 'KKIAPAY',
  FEDAPAY = 'FEDAPAY',
  STRIPE = 'STRIPE',
}

@Module({
  imports: [HttpModule],
  providers: [PaymentService],
})
export class PaymentModule {}
