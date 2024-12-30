import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../order-queue/src/prisma/prisma.service';
import { TokenPayload } from './token.type';
import { MESSAGE } from '../../../src/constants';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ) { }

    async generateAccessToken(payload: TokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN') ?? '8h'
        });
    }

    async generateRefreshToken(): Promise<string> {
        let expiresIn: string | undefined = undefined;
        expiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
        return this.jwtService.signAsync(
            {},
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: expiresIn
            }
        );
    }

    async verifyAccessToken(token?: string): Promise<TokenPayload> {
        if (!token) {
            throw new UnauthorizedException(MESSAGE.MISSING_ACCESS_TOKEN);
        }

        let payload: TokenPayload;

        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET')
            });
        } catch (error) {
            throw new UnauthorizedException(error);
        }

        return payload;
    }

    // async registerRefreshToken(token: string, userId: string): Promise<RefreshToken> {
    //     return this.prismaService.refreshToken.create({
    //         data: {
    //             token,
    //             user: { connect: { id: userId } }
    //         }
    //     });
    // }

    // async verifyRefreshToken(token?: string): Promise<RefreshToken> {
    //     if (!token) {
    //         throw new UnauthorizedException(MESSAGES.MISSING_REFRESH_TOKEN);
    //     }

    //     let refreshToken: RefreshToken;

    //     try {
    //         await this.jwtService.verifyAsync(token, {
    //             secret: this.configService.get('JWT_SECRET')
    //         });

    //         refreshToken = await this.prismaService.refreshToken.findUniqueOrThrow({
    //             where: { token }
    //         });
    //     } catch (error) {
    //         await this.prismaService.refreshToken.delete({ where: { token } });

    //         throw new UnauthorizedException(error);
    //     }

    //     return refreshToken;
    // }

    // async invalidateRefreshToken(token?: string): Promise<null> {
    //     if (!token) {
    //         throw new UnauthorizedException(MESSAGES.MISSING_REFRESH_TOKEN);
    //     }

    //     const refreshToken = await this.prismaService.refreshToken.findUnique({
    //         where: { token },
    //         select: { id: true }
    //     });

    //     if (!refreshToken) {
    //         throw new UnauthorizedException(MESSAGES.INVALID_REFRESH_TOKEN);
    //     }

    //     await this.prismaService.refreshToken.delete({ where: { id: refreshToken.id } });

    //     return null;
    // }


}
