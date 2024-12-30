import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ISendMailOptions } from '@nest-modules/mailer';

@Controller()
export class MailController {
  constructor(private readonly notifierService: MailService) {}

  @EventPattern('mail-sent')
  async sent(@Payload() payload: ISendMailOptions, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    if (await this.notifierService.send(payload)) channel.ack(originalMsg);
  }
}
