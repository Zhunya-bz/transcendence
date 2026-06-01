import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IssueStatus, IssueType, IssuePriority } from '@prisma/client';
import { ProjectMembersService } from './project-members.service';
@Injectable()
export class ProjectActivityService {
  constructor(
    private prisma: PrismaService,
    private membersService: ProjectMembersService,
  ) {}

  async getActivity(projectId: number) {
    const [issuesStatus, issuesType, issuesPriority, members, issuesAssignee] =
      await Promise.all([
        this.prisma.issue.groupBy({
          by: ['status'],
          where: {
            projectId,
            deletedAt: null,
          },
          _count: true,
        }),
        this.prisma.issue.groupBy({
          by: ['type'],
          where: {
            projectId,
            deletedAt: null,
          },
          _count: true,
        }),
        this.prisma.issue.groupBy({
          by: ['priority'],
          where: {
            projectId,
            deletedAt: null,
          },
          _count: true,
        }),
        this.membersService.getMembers(projectId),
        this.prisma.issue.groupBy({
          by: ['assigneeId'],
          where: {
            projectId,
            deletedAt: null,
          },
          _count: true,
        }),
      ]);

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

    const assigneeCountById = new Map<number | null, number>();
    for (const group of issuesAssignee) {
      assigneeCountById.set(group.assigneeId, group._count);
    }

    // create array of counts per assignee, including unassigned (null)
    const unassignedCount = assigneeCountById.get(null) ?? 0;
    const assigneeCounts = [
      {
        user: null,
        count: unassignedCount,
      },
      ...members.map((member) => ({
        user: member.user,
        count: assigneeCountById.get(member.userId) ?? 0,
      })),
    ];

    return { statusCounts, typeCounts, priorityCounts, assigneeCounts };
  }
}
