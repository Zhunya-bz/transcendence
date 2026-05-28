import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProjectWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const membership = request.membership;

    if (
      membership.role !== UserRole.ADMIN &&
      membership.role !== UserRole.MEMBER
    ) {
      throw new ForbiddenException('Project write access required');
    }

    return true;
  }
}
