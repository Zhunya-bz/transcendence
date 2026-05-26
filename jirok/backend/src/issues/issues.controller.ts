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
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { IssuesService } from './issues.service';

import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { ProjectWriteGuard } from './guards/project-write.guard';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { AssignIssueDto } from './dto/assign-issue.dto';
import {
  ApiErrorResponseDto,
  IssueResponseDto,
  IssueDetailResponseDto,
} from './dto/issues-swagger.dto';

import { CurrentUser } from '../projects/decorators/current-user.decorator';

@ApiTags('Issues')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid JWT token',
  type: ApiErrorResponseDto,
})
@Controller('projects/:projectId/issues')
@UseGuards(ProjectMemberGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  @ApiOperation({ summary: 'List issues for a project' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: IssueResponseDto, isArray: true })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  getProjectIssues(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.issuesService.getProjectIssues(projectId);
  }

  @Get(':issueId')
  @ApiOperation({ summary: 'Get one issue by ID' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiParam({ name: 'issueId', type: Number, example: 42 })
  @ApiOkResponse({ type: IssueDetailResponseDto })
  @ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  getIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return this.issuesService.getIssue(projectId, issueId);
  }

  @Post()
  @UseGuards(ProjectWriteGuard)
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiBody({ type: CreateIssueDto })
  @ApiCreatedResponse({ type: IssueResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  createIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateIssueDto,
    @CurrentUser() userId: number,
  ) {
    return this.issuesService.createIssue(projectId, dto, userId);
  }

  @Put(':issueId')
  @UseGuards(ProjectWriteGuard)
  @ApiOperation({ summary: 'Update an issue' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiParam({ name: 'issueId', type: Number, example: 42 })
  @ApiBody({ type: UpdateIssueDto })
  @ApiOkResponse({ type: IssueResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  updateIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() dto: UpdateIssueDto,
    @CurrentUser() userId: number,
  ) {
    return this.issuesService.updateIssue(projectId, issueId, dto, userId);
  }

  @Patch(':issueId/status')
  @UseGuards(ProjectWriteGuard)
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
  @UseGuards(ProjectWriteGuard)
  assignIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() dto: AssignIssueDto,
    @CurrentUser() userId: number,
  ) {
    return this.issuesService.assignIssue(projectId, issueId, dto, userId);
  }

  @Delete(':issueId')
  @UseGuards(ProjectWriteGuard)
  @ApiOperation({ summary: 'Soft delete an issue' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiParam({ name: 'issueId', type: Number, example: 42 })
  @ApiOkResponse({ type: IssueResponseDto })
  @ApiNotFoundResponse({
    description: 'Issue not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  deleteIssue(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return this.issuesService.deleteIssue(projectId, issueId);
  }
}
