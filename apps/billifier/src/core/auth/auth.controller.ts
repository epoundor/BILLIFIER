import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignUpDto, VerifyOtpDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OkResponse, VerifyOtpResponse } from './response.dto';
import { SkipAuth } from 'apps/billifier/src/decorators';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from 'apps/billifier/src/constants';

@Controller('auth')
@SkipAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiOkResponse({ type: OkResponse })
  create(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOkResponse({ type: OkResponse })
  @ApiUnauthorizedResponse()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-otp')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: VerifyOtpResponse })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.verifyOtp(dto);
    this.setTokensCookie(response, {
      ACCESS: accessToken,
      REFRESH: refreshToken,
    });
    return { accessToken, refreshToken, user };
  }

  private setTokensCookie(
    response: Response,
    tokens: Partial<Record<'ACCESS' | 'REFRESH', string>>,
  ) {
    const accessToken = tokens['ACCESS'];

    if (accessToken) {
      // @ts-ignore
      response.cookie(ACCESS_TOKEN_KEY, tokens['ACCESS'], {
        httpOnly: true,
        sameSite: 'none',
        // secure: ['production', 'staging', 'development'].includes(
        //   this.configService.get('NODE_ENV') as string
        // )
      });
    }

    const refreshToken = tokens['REFRESH'];

    if (refreshToken) {
      // @ts-ignore
      response.cookie(REFRESH_TOKEN_KEY, tokens['REFRESH'], {
        httpOnly: true,
        sameSite: 'none',
        // secure: ['production', 'staging', 'development'].includes(
        //   this.configService.get('NODE_ENV') as string
        // )
      });
    }
  }
}
