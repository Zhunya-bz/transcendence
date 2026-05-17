import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const userId = Number(request.headers['x-user-id']);
		const projectId = Number(request.params.projectId);

		const membership = await this.prisma.userProject.findUnique({
			where: {
				userId_projectId: {
					userId,
					projectId,
				},
			},
			include: {
				project: true,
			},
		});

		if (!membership || membership.project.deletedAt) {
			throw new NotFoundException('Project not found');
		}

		request.membership = membership;
		return true;
	}
}