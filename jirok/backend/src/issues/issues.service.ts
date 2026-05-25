import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { AssignIssueDto } from './dto/assign-issue.dto';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  async getProjectIssues(projectId: number) {
    return this.prisma.issue.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      include: {
        reporter: true,
        assignee: true,
      },
    });
  }

  async getIssue(projectId: number, issueId: number) {
    const issue = await this.prisma.issue.findFirst({
      where: {
        id: issueId,
        projectId,
        deletedAt: null,
      },
      include: {
        reporter: true,
        assignee: true,
      },
    });

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    return issue;
  }

  async createIssue(projectId: number, dto: CreateIssueDto, userId: number) {
    if (dto.assigneeId) {
      await this.validateAssignee(projectId, dto.assigneeId);
    }

    return this.prisma.issue.create({
      data: {
        ...dto,
        projectId,
        reporterId: userId,
      },
    });
  }

  async updateIssue(
    projectId: number,
    issueId: number,
    dto: UpdateIssueDto,
    userId: number,
  ) {
    await this.getIssue(projectId, issueId); // use getissue logic to see if it exists. It throws 404 if not found which stops the update logic from running

    if (dto.assigneeId) {
      await this.validateAssignee(projectId, dto.assigneeId);
    }

    return this.prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        ...dto,
        changedUserId: userId,
      },
    });
  }

  async updateIssueStatus(
    projectId: number,
    issueId: number,
    dto: UpdateIssueStatusDto,
    userId: number,
  ) {
    await this.getIssue(projectId, issueId);

    return this.prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        status: dto.status,
        changedUserId: userId,
      },
    });
  }

  async assignIssue(
    projectId: number,
    issueId: number,
    dto: AssignIssueDto,
    userId: number,
  ) {
    await this.getIssue(projectId, issueId);

    if (dto.assigneeId) {
      await this.validateAssignee(projectId, dto.assigneeId);
    }

    return this.prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        assigneeId: dto.assigneeId,
        changedUserId: userId,
      },
    });
  }

  async deleteIssue(projectId: number, issueId: number) {
    await this.getIssue(projectId, issueId);

    return this.prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private async validateAssignee(projectId: number, assigneeId: number) {
    const membership = await this.prisma.userProject.findUnique({
      where: {
        userId_projectId: {
          userId: assigneeId,
          projectId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestException('Assignee must belong to the project');
    }
  }
}
