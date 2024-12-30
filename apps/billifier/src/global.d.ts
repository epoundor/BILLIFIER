declare module 'express' {
    interface Request {
        user: TokenPayload &
        Partial<{
            accessToken: string;
            refreshToken: string;
        }>;
    }
}