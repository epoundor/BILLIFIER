import { Injectable, Logger } from '@nestjs/common';
import { OrderBookedDto } from './dto/order-booked.dto';
import { TicketPdfService } from './ticket-pdf/ticket-pdf.service';
import { MailService } from './mail/mail.service';
import { FileAdapter, FileService } from '@billifier/file';

@Injectable()
export class OrderQueueService {
  private readonly logger: Logger = new Logger(OrderQueueService.name);

  constructor(
    private ticketPdf: TicketPdfService,
    private mailService: MailService,
    private readonly fileService: FileService,
  ) {}

  async handleOrderBooked(payload: OrderBookedDto) {
    this.logger.log(`Generating ticket for order: ${payload.order.id}`);
    const tickets = await this.ticketPdf.generateTicketsPdf(payload);

    const attachments = await Promise.all(
      tickets.map(async (ticket, idx) => ({
        filename: `ticket-${ticket.code}.pdf`,
        contentType: 'application/pdf',
        path: await this.fileService.upload(
          ticket.content,
          `ticket-${idx}.pdf`,
        ),
      })),
    );

    for (let index = 0; index < attachments.length; index++) {
      const path = attachments[index].path;
      this.fileService.delete(path);
    }

    await this.mailService.send({
      to: payload.email,
      subject: `Ticket${payload.order.quantity > 1 ? 's' : ''} pour ${payload.order.ticketId}`,
      attachments,
      template: 'ticket',
      payload: {
        email: payload.email,
        name: payload.order.buyer.name,
        isMulti: payload.order.quantity > 1,
        date: new Date().toLocaleString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
        }),
      },
    });
    this.logger.log(`Ticket generated for order: ${payload.order.id}`);
  }
}
