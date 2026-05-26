import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const rawKey = request.headers['x-api-key'];
        if (!rawKey) {
            throw new UnauthorizedException('API key is missing');
        }

        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        const apiKey = await this.usersService.findByApiKeyHash(keyHash);
        if (!apiKey) {
            throw new UnauthorizedException('Invalid API key');
        }

        const projectId = parseInt(request.params.projectId || request.params.id);
        if (projectId && apiKey.project.id !== projectId) {
            throw new ForbiddenException('This API key is not authorized for this project');
        }

        request.user = { userId: apiKey.user.id, email: apiKey.user.email };

        return true;
    }
}