import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private async generateProjectKey(name: string): Promise<string> {
    const initials = name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 5);

    const baseKey = initials || 'PRJ';

    let key = baseKey;
    let counter = 1;

    while (
      await this.prisma.project.findUnique({
        where: { projectKey: key },
      })
    ) {
      counter++;
      key = `${baseKey}${counter}`.slice(0, 10);
    }

    return key;
  }

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
    const projectKey = await this.generateProjectKey(dto.name);

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: dto.name,
          projectKey,
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
