import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IssueStatus, IssuePriority, IssueType } from '@prisma/client';

export class IssueUserDto {
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

export class IssueResponseDto {
  @ApiProperty({ example: 12 })
  id!: number;

  @ApiProperty({ example: 7 })
  projectId!: number;

  @ApiProperty({ example: 5 })
  reporterId!: number;

  @ApiPropertyOptional({ example: null, nullable: true })
  assigneeId?: number | null;

  @ApiProperty({ enum: IssueStatus, enumName: 'IssueStatus' })
  status!: IssueStatus;

  @ApiProperty({ enum: IssueType, enumName: 'IssueType' })
  type!: IssueType;

  @ApiProperty({ example: 'Fix login redirect' })
  title!: string;

  @ApiPropertyOptional({ example: 'When signing in, users are redirected...' })
  description?: string | null;

  @ApiProperty({ enum: IssuePriority, enumName: 'IssuePriority' })
  priority!: IssuePriority;

  @ApiProperty({ example: '2026-05-21T10:15:30.000Z' })
  created!: Date;

  @ApiProperty({ example: '2026-05-21T10:15:30.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ example: null, nullable: true })
  deletedAt?: Date | null;
}

export class IssueDetailResponseDto extends IssueResponseDto {
  @ApiPropertyOptional({ type: IssueUserDto })
  reporter?: IssueUserDto;

  @ApiPropertyOptional({ type: IssueUserDto })
  assignee?: IssueUserDto | null;

  @ApiPropertyOptional({ type: IssueUserDto })
  changedUser?: IssueUserDto | null;
}

export class IssueApiErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Issue not found' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['title should not be empty'],
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: 'Not Found' })
  error!: string;
}
