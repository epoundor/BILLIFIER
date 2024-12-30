import { Controller } from '@nestjs/common';
import { OrderQueueService } from './order-queue.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderBookedDto } from './dto/order-booked.dto';

@Controller()
export class OrderQueueController {
  constructor(private readonly orderQueueService: OrderQueueService) {}

  @EventPattern('order-booked')
  handleOrderBooked(@Payload() payload: OrderBookedDto) {
    this.orderQueueService.handleOrderBooked(payload);
  }
}
