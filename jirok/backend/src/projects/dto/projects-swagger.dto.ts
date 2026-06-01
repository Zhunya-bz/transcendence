import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IssuePriority,
  IssueStatus,
  IssueType,
  UserRole,
} from '@prisma/client';

export class ProjectResponseDto {
  @ApiProperty({ example: 12 })
  id!: number;

  @ApiProperty({ example: 'Platform Migration' })
  name!: string;

  @ApiProperty({
    example: 'PLATF',
    description: 'Unique project key generated from project name initials',
  })
  projectKey!: string;

  @ApiProperty({ example: '2026-05-21T10:15:30.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-05-21T10:15:30.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ example: null, nullable: true })
  deletedAt?: Date | null;
}

export class ProjectMembersCountDto {
  @ApiProperty({ example: 8 })
  members!: number;
}

export class ProjectDetailResponseDto extends ProjectResponseDto {
  @ApiProperty({ type: ProjectMembersCountDto })
  _count!: ProjectMembersCountDto;
}

export class ProjectMemberUserDto {
  @ApiProperty({ example: 5 })
  id!: number;

  @ApiProperty({ example: 'Alexis' })
  name!: string;

  @ApiPropertyOptional({ example: 'Lopez', nullable: true })
  surname?: string | null;

  @ApiProperty({ example: 'alexis@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  avatarUrl?: string | null;
}

export class ProjectAssigneeCountItemDto {
  @ApiPropertyOptional({ type: ProjectMemberUserDto, nullable: true })
  user?: ProjectMemberUserDto | null;

  @ApiProperty({ example: 5 })
  count!: number;
}

export class ProjectMemberResponseDto {
  @ApiProperty({ example: 5 })
  userId!: number;

  @ApiProperty({ example: 12 })
  projectId!: number;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role!: UserRole;

  @ApiProperty({ example: '2026-05-21T10:15:30.000Z' })
  joinedAt!: Date;

  @ApiPropertyOptional({ type: ProjectMemberUserDto })
  user?: ProjectMemberUserDto;
}

export class ProjectActivityItemDto {
  @ApiProperty({ enum: IssueStatus, enumName: 'IssueStatus' })
  status!: IssueStatus;

  @ApiProperty({ example: 14 })
  _count!: number;
}

export class ProjectActivityCountMapDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      TODO: 4,
      IN_PROGRESS: 2,
      IN_REVIEW: 1,
      DONE: 7,
    },
  })
  statusCounts!: Record<IssueStatus, number>;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      BUG: 3,
      TASK: 8,
      STORY: 1,
    },
  })
  typeCounts!: Record<IssueType, number>;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'number' },
    example: {
      LOW: 2,
      MEDIUM: 5,
      HIGH: 1,
    },
  })
  priorityCounts!: Record<IssuePriority, number>;

  @ApiProperty({
    type: ProjectAssigneeCountItemDto,
    isArray: true,
    description:
      'First entry is the count of unassigned issues. Remaining entries are counts per project member.',
    example: [
      {
        user: null,
        count: 3,
      },
      {
        user: {
          id: 5,
          name: 'Alexis',
          surname: 'Lopez',
          email: 'alexis@example.com',
          avatarUrl: null,
        },
        count: 7,
      },
    ],
  })
  assigneeCounts!: ProjectAssigneeCountItemDto[];
}

export class ProjectMyRoleResponseDto {
  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role!: UserRole;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Project not found' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['name should not be empty'],
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: 'Not Found' })
  error!: string;
}
