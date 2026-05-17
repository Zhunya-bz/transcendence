import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { IssueStatus } from '../../generated/prisma';

export class ProjectIssuesQueryDto {
	@IsOptional()
	@IsEnum(IssueStatus)
	status?: IssueStatus;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	assignee?: number;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	page = 1;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit = 20;
}