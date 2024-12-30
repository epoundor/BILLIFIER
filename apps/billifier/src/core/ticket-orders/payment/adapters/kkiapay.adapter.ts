import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { KkiapayMetadata } from '../dto';
import { IPaymentAdapter } from './payment.adapter.interface';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, tap } from 'rxjs';
import { AxiosError } from 'axios';

export class KkiapayAdapter implements IPaymentAdapter {
  private readonly logger: Logger = new Logger(KkiapayAdapter.name);
  private readonly httpService: HttpService = new HttpService();

  constructor(
    private readonly apiKey: string,
    private readonly secretKey: string,
    private readonly privateKey: string,
  ) {}

  async makePayment(
    amount: number,
    metadata?: KkiapayMetadata,
  ): Promise<string> {
    this.logger.log('Request to KKIAPAY');
    try {
      const { data } = await lastValueFrom(
        this.httpService.post<{ payment_link: string }>(
          'https://api-staging.kkiapay.me/api/partner/payments/generate',
          {
            ...metadata,
            amount,
            target: "BILLIFIER"
          },
          {
            headers: {
              'x-api-key': this.apiKey,
              'x-secret-key': this.secretKey,
              'x-private-key': this.privateKey,
              'Content-Type': 'application/json',
            },
          },
        ),
        // .pipe(
        //   catchError((error: AxiosError) => {
        //     this.logger.error(error);
        //     throw new InternalServerErrorException(
        //       'An error happened during payment!',
        //     );
        //   }),
        // ),
      );

      return data.payment_link;
    } catch (error) {
      const err = error as AxiosError;
      throw new HttpException(err.response.data, err.response.status);
    }
  }

  async checkTransactionStatus(transactionId: string): Promise<string> {
    const response = await fetch(
      `https://api.kkiapay.me/api/v1/transactions/${transactionId}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );
    const data = await response.json();
    return data.status;
  }

  async cancelTransaction(transactionId: string): Promise<any> {
    throw new Error('Kkiapay does not support transaction cancellations.');
  }

  refundTransaction(transactionId: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
