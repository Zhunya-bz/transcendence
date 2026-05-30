import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IssueStatus, IssueType, IssuePriority } from '@prisma/client';
@Injectable()
export class ProjectActivityService {
  constructor(private prisma: PrismaService) {}

  async getActivity(projectId: number) {
    const issuesStatus = await this.prisma.issue.groupBy({
      by: ['status'],
      where: {
        projectId,
        deletedAt: null,
      },
      _count: true,
    });

    const issuesType = await this.prisma.issue.groupBy({
      by: ['type'],
      where: {
        projectId,
        deletedAt: null,
      },
      _count: true,
    });

    const issuesPriority = await this.prisma.issue.groupBy({
      by: ['priority'],
      where: {
        projectId,
        deletedAt: null,
      },
      _count: true,
    });

    // build Records for status and type with 0 counts for missing values
    const statusCounts: Record<IssueStatus, number> = {} as Record<
      IssueStatus,
      number
    >;
    for (const s of Object.values(IssueStatus) as IssueStatus[])
      statusCounts[s] = 0;

    for (const g of issuesStatus) statusCounts[g.status] = g._count;

    // same for type
    const typeCounts: Record<IssueType, number> = {} as Record<
      IssueType,
      number
    >;
    for (const s of Object.values(IssueType) as IssueType[]) typeCounts[s] = 0;

    for (const g of issuesType) typeCounts[g.type] = g._count;

    // same for priority
    const priorityCounts: Record<IssuePriority, number> = {} as Record<
      IssuePriority,
      number
    >;
    for (const s of Object.values(IssuePriority) as IssuePriority[])
      priorityCounts[s] = 0;

    for (const g of issuesPriority) priorityCounts[g.priority] = g._count;

    return { statusCounts, typeCounts, priorityCounts };
  }
}
