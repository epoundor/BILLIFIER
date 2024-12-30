import { Injectable, Logger } from '@nestjs/common';
import * as Pdf from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';
import { OrderBookedDto } from '../dto/order-booked.dto';
import { toBuffer as qrCodeToBuffer, toDataURL } from 'qrcode';
import { TicketTemplate } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class TicketPdfService {
  private readonly logger: Logger = new Logger(TicketPdfService.name);

  private readonly size: [number, number] = [493.5, 1498.5];
  constructor(private prisma: PrismaService) {}

  async generateTicketsPdf(payload: OrderBookedDto) {
    const { userTickets, ticket } = await this.prisma.ticketOrder.findFirst({
      where: {
        id: payload.order.id,
      },
      select: {
        userTickets: { select: { code: true } },
        ticket: { select: { ticketTemplate: true } },
      },
    });

    const ticketsPdfs: Buffer[] = [];
    for (let index = 0; index < userTickets.length; index++) {
      ticketsPdfs.push(
        await this.generateTicketPdf(
          userTickets[index].code,
          ticket.ticketTemplate,
        ),
      );
    }

    return ticketsPdfs.map((buffer, idx) => ({
      content: buffer,
      code: userTickets[idx].code,
    }));
  }
  async generateTicketPdf(code: string, ticketTemplate: TicketTemplate) {
    const document = new Pdf({
      size: this.size,
      layout: 'landscape',
      margin: 0,
    });

    const qrCodeImage = await this.generateQrCode(code);

    const qrcodeSetting = {
      x: ticketTemplate.qrCodeSetting[0],
      y: ticketTemplate.qrCodeSetting[1],
      with: ticketTemplate.qrCodeSetting[2],
      height: ticketTemplate.qrCodeSetting[3],
      //   fit: ticketTemplate.qrCodeSetting ? undefined : size,
    };

    if (ticketTemplate.backgroundImage) {
      const bgUrl = await this.convertImageUrlToBase64(
        ticketTemplate.backgroundImage,
      );
      if (!bgUrl) return;
      document.image(bgUrl, 0, 0, {
        width: this.size[1],
        height: this.size[0],
        align: 'center',
        valign: 'center',
      });
    }

    document
      .image(qrCodeImage, qrcodeSetting.x, qrcodeSetting.y, {
        width: qrcodeSetting.with,
        height: qrcodeSetting.height,
        // fit: qrcodeSetting.fit,
      })
      .end();

    return await new Promise<Buffer>((resolve, reject) => {
      const buffers: Buffer[] = [];

      document.on('data', (data) => buffers.push(data));
      document.on('end', () => resolve(Buffer.concat(buffers)));
      document.on('error', reject);
    });
  }

  /**
   * Generates a QR code from a given string.
   * @param text - The string to encode in the QR code.
   * @param outputFile - (Optional) Path to save the QR code as a file. If omitted, returns a Base64 string.
   * @returns A promise that resolves to the QR code (Base64 or file path).
   */
  private async generateQrCode(
    text: string,
    outputFile?: string,
  ): Promise<Buffer | string> {
    try {
      if (outputFile) {
        // Generate QR code and save to a file
        return await qrCodeToBuffer(text, {
          type: 'png',
          errorCorrectionLevel: 'L',
          margin: 0,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
      } else {
        // Generate QR code as Base64 string
        const qrCodeDataUrl = await toDataURL(text);
        return qrCodeDataUrl;
      }
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }
  /**
   * Converts a given pixel dimension and physical size into DPI.
   * @param pixels - The number of pixels in the dimension (width or height).
   * @param physicalSizeInInches - The physical size in inches corresponding to the pixel dimension.
   * @returns The DPI (dots per inch) value.
   */
  private convertPixelsIntoDpi(
    pixels: number,
    physicalSizeInInches: number = 20,
  ): number {
    if (physicalSizeInInches <= 0) {
      throw new Error('Physical size in inches must be greater than zero.');
    }
    return pixels / physicalSizeInInches;
  }

  async convertImageUrlToBase64(
    url: string,
    retry: number = 3,
  ): Promise<string | false> {
    const retryCount = retry;

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const mimeType = response.headers['content-type'];
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      this.logger.log(`'Retrying' ${retryCount}`);
      if (retryCount === 0) {
        this.logger.log(`Failed to fetch image: ${url}`);
        return false;
      }

      return this.convertImageUrlToBase64(url, retryCount - 1);
    }
  }
}
