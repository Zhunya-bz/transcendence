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
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProjectsService } from './services/projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectActivityService } from './services/project-activity.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberByIdDto } from './dto/add-project-member-by-id.dto';
import { AddProjectMemberByEmailDto } from './dto/add-project-member-by-email.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';
import {
  ApiErrorResponseDto,
  ProjectActivityItemDto,
  ProjectDetailResponseDto,
  ProjectMemberResponseDto,
  ProjectResponseDto,
} from './dto/projects-swagger.dto';

import { CurrentUser } from './decorators/current-user.decorator';
import { ProjectAdminOnly } from './decorators/project-admin-only.decorator';
import { ProjectMemberGuard } from './guards/project-member.guard';

import type { Request } from 'express';

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

  // List projects endpoint

  @ApiOperation({ summary: 'List projects for the authenticated user' })
  @ApiOkResponse({ type: ProjectResponseDto, isArray: true })
  @Get()
  findAll(@CurrentUser() userId: number) {
    return this.projectsService.findAll(userId);
  }

  // Create project endpoint

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

  // Get one project endpoint

  @ApiOperation({ summary: 'Get one project by ID' })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: ProjectDetailResponseDto })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @UseGuards(ProjectMemberGuard)
  @Get(':projectId')
  findOne(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.findOne(projectId);
  }

  // Update project endpoint

  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOperation({ summary: 'Update a project' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ProjectAdminOnly
  @Put(':projectId')
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(projectId, dto);
  }

  // Project soft delete endpoint

  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOperation({ summary: 'Soft delete a project' })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ProjectAdminOnly
  @Delete(':projectId')
  remove(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.remove(projectId);
  }

  // Project members endpoints

  @ApiOperation({ summary: 'List project members' })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: ProjectMemberResponseDto, isArray: true })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @UseGuards(ProjectMemberGuard)
  @Get(':projectId/members')
  getMembers(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.membersService.getMembers(projectId);
  }

  // Add member by ID endpoint

  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOperation({ summary: 'Add a member to a project' })
  @ApiBody({ type: AddProjectMemberByIdDto })
  @ApiCreatedResponse({ type: ProjectMemberResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ProjectAdminOnly
  @Post(':projectId/members')
  addMemberById(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: AddProjectMemberByIdDto,
  ) {
    return this.membersService.addMemberById(projectId, dto);
  }

  // Add member by email endpoint

  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOperation({ summary: 'Add a member to a project by email' })
  @ApiBody({ type: AddProjectMemberByEmailDto })
  @ApiCreatedResponse({ type: ProjectMemberResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ProjectAdminOnly
  @Post(':projectId/members/by-email')
  addMemberByEmail(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: AddProjectMemberByEmailDto,
  ) {
    return this.membersService.addMemberByEmail(projectId, dto);
  }

  // Get currentuser role endpoint

  @UseGuards(ProjectMemberGuard)
  @Get(':projectId/role')
  getMyRole(@Req() request: Request) {
    return { role: request.membership!.role };
  }

  // Update member role endpoint

  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiParam({ name: 'userId', type: Number, example: 5 })
  @ApiOperation({ summary: 'Update a project member role' })
  @ApiBody({ type: UpdateProjectMemberRoleDto })
  @ApiOkResponse({ type: ProjectMemberResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ApiErrorResponseDto,
  })
  @ProjectAdminOnly
  @Put(':projectId/members/:userId')
  updateMemberRole(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateProjectMemberRoleDto,
  ) {
    return this.membersService.updateRole(projectId, userId, dto);
  }

  // Removemember endpoint

  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiParam({ name: 'userId', type: Number, example: 5 })
  @ApiOperation({ summary: 'Remove a member from a project' })
  @ApiOkResponse({ type: ProjectMemberResponseDto })
  @ApiBadRequestResponse({
    description: 'Cannot remove the last admin from project',
    type: ApiErrorResponseDto,
  })
  @ProjectAdminOnly
  @Delete(':projectId/members/:userId')
  removeMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.membersService.removeMember(projectId, userId);
  }

  // Activity endpoint

  @ApiOperation({
    summary: 'Get issue activity grouped by status for a project',
  })
  @ApiParam({ name: 'projectId', type: Number, example: 12 })
  @ApiOkResponse({ type: ProjectActivityItemDto, isArray: true })
  @ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  })
  @UseGuards(ProjectMemberGuard)
  @Get(':projectId/activity')
  getActivity(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.activityService.getActivity(projectId);
  }
}
