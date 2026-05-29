import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { IssuePriority, IssueStatus, IssueType } from '@prisma/client';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIssueDto {
  @ApiProperty({ example: 'Fix login redirect' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'When signing in, users are redirected...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: IssueStatus, enumName: 'IssueStatus' })
  @IsEnum(IssueStatus)
  status!: IssueStatus;

  @ApiProperty({ enum: IssuePriority, enumName: 'IssuePriority' })
  @IsEnum(IssuePriority)
  priority!: IssuePriority;

  @ApiProperty({ enum: IssueType, enumName: 'IssueType' })
  @IsEnum(IssueType)
  type!: IssueType;

  @ApiPropertyOptional({ example: 5, nullable: true })
  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  reporterId!: number;
}
