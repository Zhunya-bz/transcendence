import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends
PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                console.log("+===", req.headers, req?.cookies);
                return req?.cookies?.['token'] ?? null;
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
        });
    }

    async validate(payload: { sub: number; email: string }) {
        console.log("======", payload.sub, payload.email);
        return { userId: payload.sub, email: payload.email };
    }
}