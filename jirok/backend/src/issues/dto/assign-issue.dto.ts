import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignIssueDto {
  @ApiPropertyOptional({ example: 5, nullable: true })
  @IsOptional()
  @IsInt()
  assigneeId?: number;
}
