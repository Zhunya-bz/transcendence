import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AllowApiKey } from '../auth/decorators/allow-api-key.decorator';
import { ProjectsService } from './services/projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectActivityService } from './services/project-activity.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberByIdDto } from './dto/add-project-member-by-id.dto';
import { AddProjectMemberByEmailDto } from './dto/add-project-member-by-email.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';
import { ProjectApiErrorResponseDto } from './dto/projects-swagger.dto';

import { CurrentUser } from './decorators/current-user.decorator';
import { ProjectAdminOnly } from './decorators/project-admin-only.decorator';
import { ProjectMemberOnly } from './decorators/project-member-only.decorator';
import {
  ApiAddProjectMemberByEmail,
  ApiAddProjectMemberById,
  ApiCreateProject,
  ApiFindAllProjects,
  ApiGetProject,
  ApiGetProjectActivity,
  ApiGetProjectMembers,
  ApiGetProjectMyRole,
  ApiRemoveProject,
  ApiRemoveProjectMember,
  ApiUpdateProject,
  ApiUpdateProjectMemberRole,
} from './decorators/project-swagger.decorator';

import type { Request } from 'express';

@ApiTags('Projects')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid JWT token',
  type: ProjectApiErrorResponseDto,
})
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly membersService: ProjectMembersService,
    private readonly activityService: ProjectActivityService,
  ) {}

  // List projects endpoint

  @ApiFindAllProjects
  @Get()
  findAll(@CurrentUser() userId: number) {
    return this.projectsService.findAll(userId);
  }

  // Create project endpoint

  @ApiCreateProject
  @Post()
  create(@CurrentUser() userId: number, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(userId, dto);
  }

  // Get one project endpoint
  @AllowApiKey()
  @ApiGetProject
  @ProjectMemberOnly
  @Get(':projectId')
  findOne(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.findOne(projectId);
  }

  // Update project endpoint
  @AllowApiKey()
  @ApiUpdateProject
  @ProjectAdminOnly
  @Put(':projectId')
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(projectId, dto);
  }

  // Project soft delete endpoint
  @AllowApiKey()
  @ApiRemoveProject
  @ProjectAdminOnly
  @Delete(':projectId')
  remove(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.remove(projectId);
  }

  // Project members endpoints
  @AllowApiKey()
  @ApiGetProjectMembers
  @ProjectMemberOnly
  @Get(':projectId/members')
  getMembers(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.membersService.getMembers(projectId);
  }

  // Add member by ID endpoint
  @AllowApiKey()
  @ApiAddProjectMemberById
  @ProjectAdminOnly
  @Post(':projectId/members')
  addMemberById(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: AddProjectMemberByIdDto,
  ) {
    return this.membersService.addMemberById(projectId, dto);
  }

  // Add member by email endpoint
  @AllowApiKey()
  @ApiAddProjectMemberByEmail
  @ProjectAdminOnly
  @Post(':projectId/members/by-email')
  addMemberByEmail(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: AddProjectMemberByEmailDto,
  ) {
    return this.membersService.addMemberByEmail(projectId, dto);
  }

  // Get currentuser role endpoint
  @ApiGetProjectMyRole
  @ProjectMemberOnly
  @Get(':projectId/role')
  getMyRole(@Req() request: Request) {
    return { role: request.membership!.role };
  }

  // Update member role endpoint
  @AllowApiKey()
  @ApiUpdateProjectMemberRole
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
  @AllowApiKey()
  @ApiRemoveProjectMember
  @ProjectAdminOnly
  @Delete(':projectId/members/:userId')
  removeMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.membersService.removeMember(projectId, userId);
  }

  // Activity endpoint
  @AllowApiKey()
  @ApiGetProjectActivity
  @ProjectMemberOnly
  @Get(':projectId/activity')
  getActivity(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.activityService.getActivity(projectId);
  }
}
