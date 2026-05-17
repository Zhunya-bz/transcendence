import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '../../generated/prisma';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        deletedAt: null,
        members: {
          some: { userId },
        },
      },
    });
  }

  async create(userId: number, dto: CreateProjectDto) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: dto.name,
          projectKey: dto.projectKey,
        },
      });

      await tx.userProject.create({
        data: {
          userId,
          projectId: project.id,
          role: UserRole.Admin,
        },
      });

      return project;
    });
  }

  async findOne(projectId: number) {
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
  }

  async update(projectId: number, dto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: dto,
    });
  }

  async remove(projectId: number) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
