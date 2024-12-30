import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TicketOrder } from '@prisma/client';

import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProducerService {
  private readonly logger: Logger = new Logger(ProducerService.name);
  constructor(
    @Inject('ORDER_QUEUE_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  async sendTicketToBuyer(email: string, order: TicketOrder) {
    try {
      this.rabbitClient.emit('order-booked', {
        email,
        order,
      });
      this.logger.log('Sent To ORDER_QUEUE_SERVICE');
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error adding mail to ORDER_QUEUE_SERVICE',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
