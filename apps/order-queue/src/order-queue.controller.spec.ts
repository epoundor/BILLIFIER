import { Test, TestingModule } from '@nestjs/testing';
import { OrderQueueController } from './order-queue.controller';
import { OrderQueueService } from './order-queue.service';

describe('OrderQueueController', () => {
  let orderQueueController: OrderQueueController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderQueueController],
      providers: [OrderQueueService],
    }).compile();

    orderQueueController = app.get<OrderQueueController>(OrderQueueController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderQueueController.getHello()).toBe('Hello World!');
    });
  });
});
