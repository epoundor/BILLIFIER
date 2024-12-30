import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

export type JwtOptions = JwtSignOptions & JwtVerifyOptions & { expiresIn: string };

export type TokenPayload = {
    sub: string;
};
