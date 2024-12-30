import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignUpDto, VerifyOtpDto } from './dto';
import { PrismaService } from '../../../../order-queue/src/prisma/prisma.service';
import { MESSAGE } from 'apps/billifier/src/constants/message.constant';
import { OtpType } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService, private mailService: MailService, private tokenService: TokenService) {
  }
  async login(loginDto: LoginDto) {
    if (!loginDto.email)
      throw new UnauthorizedException(MESSAGE.USER_NOT_FOUND)

    const user = await this.prisma.user.findUnique({
      where:
      {
        email: loginDto.email
      }
    })
    if (!user) throw new UnauthorizedException(MESSAGE.USER_NOT_FOUND)

    this.sendOtp(OtpType.REGISTER, user.email, user.id)

    return { message: MESSAGE.OTP_REQUIRED }
  }

  async signup(signupDto: SignUpDto) {
    const actualUser = await this.prisma.user.findUnique({ where: { email: signupDto.email } })

    if (actualUser) {
      this.logger.error(MESSAGE.USER_ALREADY_EXISTS, "REGISTRATION FAILED")
      throw new UnauthorizedException(MESSAGE.USER_ALREADY_EXISTS)
    }
    const createdUser = await this.prisma.user.create({
      data: {
        email: signupDto.email,
        name: signupDto.name,
        phone: signupDto.phone
      }
    })

    if (!(await this.sendOtp(OtpType.REGISTER, createdUser.email, createdUser.id))) {
      await this.prisma.user.delete({
        where: { id: createdUser.id }
      })
      this.logger.error(`user ${createdUser.id} is deleted`, "REGISTRATION FAILED")
      return { message: MESSAGE.SOMETHING_WENT_WRONG }
    }


    return { message: MESSAGE.OTP_REQUIRED }
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const findedOtp = (await this.prisma.otp.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 1,
      where: {
        user: {
          email: verifyOtp.email
        },
      }
    }))[0]


    if (!findedOtp) throw new UnauthorizedException(MESSAGE.USER_NOT_FOUND)
    if (findedOtp.code !== verifyOtp.otp) throw new UnauthorizedException(MESSAGE.USER_NOT_FOUND)
    if (findedOtp.isUsed) throw new BadRequestException(MESSAGE.OTP_EXIRED);

    const { user } = await this.prisma.otp.update({
      include: { user: true },
      data: {
        isUsed: true,
        usedAt: (new Date()).toDateString()
      },
      where: {
        id: findedOtp.id
      }
    })

    delete user.password

    const accessToken = await this.tokenService.generateAccessToken({ sub: user.id });
    const refreshToken = await this.tokenService.generateRefreshToken();


    return { user, accessToken, refreshToken }


  }

  async sendOtp(type: OtpType, email: string, userId: string) {
    const { code } = await this.prisma.otp.create({
      data: {
        code: this.generateOTP(6),
        type,
        expiredAt: new Date(Date.now() + 60 * 10), // 10 minutes later,
        userId
      }
    })

    return this.mailService.send({
      template: "signin-otp",
      subject: `${code} is your OTP`,
      to: `<${email}>`,
      payload: {
        otp: code
      }
    })
  }

  private generateOTP(n: number): string {
    let otp = '';
    for (let i = 0; i < n; i++) {
      otp += Math.floor(Math.random() * 10);  // Génère un chiffre aléatoire entre 0 et 9
    }
    return otp;
  }

}
