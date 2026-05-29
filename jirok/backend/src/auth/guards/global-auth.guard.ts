import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyGuard } from './api-key.guard';
import { UsersService } from 'src/users/users.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ALLOW_API_KEY } from '../decorators/allow-api-key.decorator';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
    private jwtGuard: JwtAuthGuard;
    private apiKeyGuard: ApiKeyGuard;

    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
    ) {
        this.jwtGuard = new JwtAuthGuard(reflector);
        this.apiKeyGuard = new ApiKeyGuard(usersService);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(), context.getClass()
        ]);
        
        if (isPublic) {
            return true;
        }
        
        const allowApiKey = this.reflector.getAllAndOverride<boolean>(ALLOW_API_KEY, [
            context.getHandler(), context.getClass()
        ]);

        const request = context.switchToHttp().getRequest();

        if (allowApiKey && request.headers['x-api-key']) {
            return this.apiKeyGuard.canActivate(context);
        }

        return this.jwtGuard.canActivate(context) as boolean | Promise<boolean>;
    }
}