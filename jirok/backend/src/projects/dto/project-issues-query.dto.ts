// import { Type } from 'class-transformer';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
// import { IssueStatus } from '@prisma/client';

// export class ProjectIssuesQueryDto {
//   @ApiPropertyOptional({ enum: IssueStatus, enumName: 'IssueStatus' })
//   @IsOptional()
//   @IsEnum(IssueStatus)
//   status?: IssueStatus;

//   @ApiPropertyOptional({
//     example: 7,
//     description: 'Filter issues assigned to this user ID',
//   })
//   @IsOptional()
//   @Type(() => Number)
//   @IsInt()
//   assignee?: number;

//   @ApiProperty({
//     example: 1,
//     minimum: 1,
//     description: 'Page number, starting at 1',
//   })
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   page = 1;

//   @ApiProperty({
//     example: 20,
//     minimum: 1,
//     description: 'Maximum number of records per page',
//   })
//   @Type(() => Number)
//   @IsInt()
//   @Min(1)
//   limit = 20;
// }

// Currently unused, but will be needed if query parameters for fetching project issues are added in the future.
