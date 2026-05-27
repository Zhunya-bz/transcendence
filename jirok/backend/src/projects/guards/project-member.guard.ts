import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Request } from 'express';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { params: { projectId: string } }>();

    const userId = request.user?.userId;
    const projectId = Number(request.params.projectId);

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

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
// Memberguard checks that the user is a member of the project and that the project is not deleted. It also attaches the membership record to the request for use in downstream guards/controllers.