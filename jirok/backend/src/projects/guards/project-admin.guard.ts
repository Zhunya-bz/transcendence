import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { UserRole } from '../../generated/prisma';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const membership = request.membership;

		if (membership.role !== UserRole.ADMIN) {
			throw new ForbiddenException('Admin access required');
		}

		return true;
	}
}