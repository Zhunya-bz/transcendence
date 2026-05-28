import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const membership = request.membership;

    if (!membership) {
      throw new NotFoundException('Project not found');
    }

    if (membership.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
// ADMIN GUARD MUST BE USED AFTER MEMBER GUARD TO ENSURE MEMBERSHIP IS LOADED
