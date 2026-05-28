import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddProjectMemberByIdDto } from '../dto/add-project-member-by-id.dto';
import { AddProjectMemberByEmailDto } from '../dto/add-project-member-by-email.dto';
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

  async addMemberById(projectId: number, dto: AddProjectMemberByIdDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.userProject.findUnique({
      where: { userId_projectId: { userId: dto.userId, projectId } },
    });

    if (existing) throw new BadRequestException('User is already a member');

    return this.prisma.userProject.create({
      data: {
        projectId,
        userId: user.id,
        role: dto.role,
      },
    });
  }

  async addMemberByEmail(projectId: number, dto: AddProjectMemberByEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.userProject.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });

    if (existing) throw new BadRequestException('User is already a member');

    return this.prisma.userProject.create({
      data: {
        projectId,
        userId: user.id,
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

    if (target.role === UserRole.ADMIN) {
      const adminCount = await this.prisma.userProject.count({
        where: {
          projectId,
          role: UserRole.ADMIN,
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
