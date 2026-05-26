import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AllowApiKey } from '../auth/decorators/allow-api-key.decorator';
import { ProjectsService } from './services/projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectActivityService } from './services/project-activity.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';
import {
  ApiErrorResponseDto,
  ProjectActivityItemDto,
  ProjectDetailResponseDto,
  ProjectMemberResponseDto,
  ProjectResponseDto,
} from './dto/projects-swagger.dto';

import { CurrentUser } from './decorators/current-user.decorator';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';

@ApiTags('Projects')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid JWT token',
  type: ApiErrorResponseDto,
})
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly membersService: ProjectMembersService,
    private readonly activityService: ProjectActivityService,
  ) {}

  @ApiOperation({ summary: 'List projects for the authenticated user' })
  @ApiOkResponse({ type: ProjectResponseDto, isArray: true })
  @Get()
  findAll(@CurrentUser() userId: number) {
    return this.projectsService.findAll(userId);
  }

  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @Post()
  create(@CurrentUser() userId: number, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Get one project by ID' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: ProjectDetailResponseDto })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @Get(':projectId')
  findOne(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.findOne(projectId);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard, ProjectAdminGuard)
  @ApiOperation({ summary: 'Update a project' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiBody({ type: UpdateProjectDto })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
    type: ApiErrorResponseDto,
  })
  @Put(':projectId')
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(projectId, dto);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard, ProjectAdminGuard)
  @ApiOperation({ summary: 'Soft delete a project' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
    type: ApiErrorResponseDto,
  })
  @Delete(':projectId')
  remove(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.remove(projectId);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'List project members' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: ProjectMemberResponseDto, isArray: true })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @Get(':projectId/members')
  getMembers(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.membersService.getMembers(projectId);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard, ProjectAdminGuard)
  @ApiOperation({ summary: 'Add a member to a project' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiBody({ type: AddProjectMemberDto })
  @ApiCreatedResponse({ type: ProjectMemberResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
    type: ApiErrorResponseDto,
  })
  @Post(':projectId/members')
  addMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: AddProjectMemberDto,
  ) {
    return this.membersService.addMember(projectId, dto);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard, ProjectAdminGuard)
  @ApiOperation({ summary: 'Update a project member role' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiParam({ name: 'userId', type: Number, example: 5 })
  @ApiBody({ type: UpdateProjectMemberRoleDto })
  @ApiOkResponse({ type: ProjectMemberResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project or user membership not found',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
    type: ApiErrorResponseDto,
  })
  @Put(':projectId/members/:userId')
  updateMemberRole(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateProjectMemberRoleDto,
  ) {
    return this.membersService.updateRole(projectId, userId, dto);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard, ProjectAdminGuard)
  @ApiOperation({ summary: 'Remove a member from a project' })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiParam({ name: 'userId', type: Number, example: 5 })
  @ApiOkResponse({ type: ProjectMemberResponseDto })
  @ApiBadRequestResponse({
    description: 'Cannot remove the last admin from project',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Project or user membership not found',
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
    type: ApiErrorResponseDto,
  })
  @Delete(':projectId/members/:userId')
  removeMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.membersService.removeMember(projectId, userId);
  }

  @AllowApiKey()
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({
    summary: 'Get issue activity grouped by status for a project',
  })
  @ApiHeader({
    name: 'x-user-id',
    required: true,
    description: 'Current user ID used by project membership guards',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: ProjectActivityItemDto, isArray: true })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @Get(':projectId/activity')
  getActivity(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.activityService.getActivity(projectId);
  }
}
