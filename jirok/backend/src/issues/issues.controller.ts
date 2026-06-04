import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { IssuesService } from './issues.service';

import { ProjectMemberOnly } from '../projects/decorators/project-member-only.decorator';
import { ProjectWriteOnly } from '../projects/decorators/project-write-only.decorator';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { AssignIssueDto } from './dto/assign-issue.dto';
import { IssueApiErrorResponseDto } from './dto/issues-swagger.dto';

import { CurrentUser } from '../projects/decorators/current-user.decorator';
import {
  ApiAssignIssue,
  ApiCreateIssue,
  ApiDeleteIssue,
  ApiGetIssue,
  ApiGetProjectIssues,
  ApiUpdateIssue,
  ApiUpdateIssueStatus,
} from './decorators/issue-swagger.decorator';

@ApiTags('Issues')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid JWT token',
  type: IssueApiErrorResponseDto,
})
@Controller('projects/:projectId/issues')
@ProjectMemberOnly
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  @ApiGetProjectIssues
  getProjectIssues(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.issuesService.getProjectIssues(projectId);
  }

  @Get(':issueId')
  @ApiGetIssue
  getIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return this.issuesService.getIssue(projectId, issueId);
  }

  @Post()
  @ProjectWriteOnly
  @ApiCreateIssue
  createIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateIssueDto,
  ) {
    return this.issuesService.createIssue(projectId, dto);
  }

  @Put(':issueId')
  @ProjectWriteOnly
  @ApiUpdateIssue
  updateIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() dto: UpdateIssueDto,
    @CurrentUser() userId: number,
  ) {
    return this.issuesService.updateIssue(projectId, issueId, dto, userId);
  }

  @Patch(':issueId/status')
  @ProjectWriteOnly
  @ApiUpdateIssueStatus
  updateIssueStatus(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() dto: UpdateIssueStatusDto,
    @CurrentUser() userId: number,
  ) {
    return this.issuesService.updateIssueStatus(
      projectId,
      issueId,
      dto,
      userId,
    );
  }

  @Patch(':issueId/assign')
  @ProjectWriteOnly
  @ApiAssignIssue
  assignIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() dto: AssignIssueDto,
    @CurrentUser() userId: number,
  ) {
    return this.issuesService.assignIssue(projectId, issueId, dto, userId);
  }

  @Delete(':issueId')
  @ProjectWriteOnly
  @ApiDeleteIssue
  deleteIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return this.issuesService.deleteIssue(projectId, issueId);
  }
}
