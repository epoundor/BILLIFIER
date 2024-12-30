import { MailMetadata, MailTemplatePayload } from '@billifier/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MailService {
  private readonly logger: Logger = new Logger(MailService.name);

  constructor(
    @Inject('NOTIFIER_QUEUE_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  async send<T extends keyof MailTemplatePayload>(data: MailMetadata<T>) {
    try {
      this.rabbitClient.emit('mail-sent', data);
      this.logger.log(`Sent to queue"`);

      return { sent: true };
    } catch (error) {
      this.logger.error(`Error while sending to NOTIFIER_QUEUE_SERVICE`);
      return false;
    }
  }
}
