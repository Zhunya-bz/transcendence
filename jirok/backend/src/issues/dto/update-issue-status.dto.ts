import { IsEnum } from 'class-validator';
import { IssueStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIssueStatusDto {
  @ApiProperty({ enum: IssueStatus, enumName: 'IssueStatus' })
  @IsEnum(IssueStatus)
  status!: IssueStatus;
}
