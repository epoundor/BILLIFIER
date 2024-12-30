import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ACCESS_TOKEN_KEY, MESSAGE, REFRESH_TOKEN_KEY, SKIP_AUTH_KEY } from '../../src/constants';
import { TokenService } from '../../src/core/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly tokenService: TokenService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const skipAuth: boolean = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        
        const refreshToken = this.extractTokenFromCookies(request, REFRESH_TOKEN_KEY);
        
        if (skipAuth) {
            request.user = {
                sub: '',
                refreshToken: refreshToken
            };

            return true;
        }
        
        const accessToken = this.extractTokenFromCookies(request, ACCESS_TOKEN_KEY);

        if (!accessToken) {
            throw new UnauthorizedException(MESSAGE.MISSING_ACCESS_TOKEN);
        }

        const verifiedAccessTokenPayload = await this.tokenService.verifyAccessToken(accessToken);

        request.user = {
            ...verifiedAccessTokenPayload,
            accessToken: accessToken,
            refreshToken: refreshToken
        };

        return true;
    }

    private extractTokenFromCookies(
        request: Request,
        tokenKey: typeof ACCESS_TOKEN_KEY | typeof REFRESH_TOKEN_KEY
    ): string | undefined {
        return request.cookies[tokenKey];
    }
}
