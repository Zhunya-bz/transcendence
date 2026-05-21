import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddProjectMemberDto } from '../dto/add-project-member.dto';
import { UpdateProjectMemberRoleDto } from '../dto/update-project-member-role.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProjectMembersService {
  constructor(private prisma: PrismaService) {}

  async getMembers(projectId: number) {
    return this.prisma.userProject.findMany({
      where: { projectId },
      include: { user: true },
    });
  }

  async addMember(projectId: number, dto: AddProjectMemberDto) {
    return this.prisma.userProject.create({
      data: {
        projectId,
        userId: dto.userId,
        role: dto.role,
      },
    });
  }

  async updateRole(
    projectId: number,
    userId: number,
    dto: UpdateProjectMemberRoleDto,
  ) {
    return this.prisma.userProject.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      data: {
        role: dto.role,
      },
    });
  }

  async removeMember(projectId: number, userId: number) {
    const target = await this.prisma.userProject.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    if (!target) throw new NotFoundException();

    if (target.role === UserRole.Admin) {
      const adminCount = await this.prisma.userProject.count({
        where: {
          projectId,
          role: UserRole.Admin,
        },
      });

      if (adminCount === 1) {
        throw new BadRequestException('Cannot remove last admin');
      }
    }

    return this.prisma.userProject.delete({
      where: {
        userId_projectId: { userId, projectId },
      },
    });
  }
}
