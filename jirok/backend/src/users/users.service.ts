import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

const USER_SELECT = {
  id: true,
  name: true,
  surname: true,
  email: true,
  jobTitle: true,
  jobOrganization: true,
  location: true,
  avatarUrl: true,
  accountCreated: true,
  updatedAt: true,
  deletedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(page: number = 1, limit: number = 20) {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select: USER_SELECT,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id: id, deletedAt: null },
      select: USER_SELECT,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
  }

  async remove(id: number) {
    return this.prisma.user.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findUserProjects(id: number) {
    return this.prisma.userProject.findMany({
      where: { userId: id },
      include: { project: true },
    });
  }

  async findUserIssues(id: number) {
    return this.prisma.issue.findMany({
      where: { assigneeId: id, deletedAt: null },
    });
  }

  async createApiKey(userId: number, projectId: number, keyHash: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    return this.prisma.apiKey.create({
      data: {
        userId,
        projectId,
        keyHash,
      },
    });
  }

  async findByApiKeyHash(keyHash: string) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: true, project: true },
    });
    return apiKey;
  }

  async updateAvatarUrl(userId: number, filePath: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: filePath },
      select: { avatarUrl: true },
    });
  }


  async findByFortyTwoId(fortyTwoId: string) {
    return this.prisma.user.findFirst({
      where: {
        fortyTwoId,
        deletedAt: null,
      },
    });
  }

  async linkFortyTwoAccount(userId: number, fortyTwoId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fortyTwoId,
      },
    });
  }

  async createOAuthUser(data: {
    fortyTwoId: string;
    email: string;
    name: string;
    surname?: string;
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash: null,
      },
    });
  }
}
