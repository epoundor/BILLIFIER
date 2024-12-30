import { ISendMailOptions, MailerService } from '@nest-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger: Logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async send(data: ISendMailOptions & { payload?: Record<string, string> }) {
    try {
      this.logger.log(
        `=== Sending mail to ${data.to} with subject "${data.subject ?? 'unknown'}==="`,
      );

      const mailInfo = await this.mailerService.sendMail({
        ...data,
        context: {
          // send payload if it's necessary
          ...data?.payload,
        },
      });
      this.logger.log(mailInfo);
      this.logger.log(
        `=== Mail sent to ${data.to} with subject "${data.subject ?? 'unknown'} ==="`,
      );

      return { sent: true };
    } catch (error) {
      this.logger.error(`=== Error while sending mail to ${data.to}: ${error} ===`);
      return false;
    }
  }
}
