import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ProjectsService } from './services/projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectActivityService } from './services/project-activity.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';

import { CurrentUser } from './decorators/current-user.decorator';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
	constructor(
		private readonly projectsService: ProjectsService,
		private readonly membersService: ProjectMembersService,
		private readonly activityService: ProjectActivityService,
	) {}

	@Get()
	findAll(
		@CurrentUser() userId: number,
	) {
		return this.projectsService.findAll(userId);
	}

	@Post()
	create(
		@CurrentUser() userId: number,
		@Body() dto: CreateProjectDto,
	) {
		return this.projectsService.create(userId, dto);
	}

	@UseGuards(ProjectMemberGuard)
	@Get(':projectId')
	findOne(@Param('projectId', ParseIntPipe) projectId: number) {
		return this.projectsService.findOne(projectId);
	}

	@UseGuards(ProjectMemberGuard, ProjectAdminGuard)
	@Put(':projectId')
	update(
		@Param('projectId', ParseIntPipe) projectId: number,
		@Body() dto: UpdateProjectDto,
	) {
		return this.projectsService.update(projectId, dto);
	}

	@UseGuards(ProjectMemberGuard, ProjectAdminGuard)
	@Delete(':projectId')
	remove(@Param('projectId', ParseIntPipe) projectId: number) {
		return this.projectsService.remove(projectId);
	}

	@UseGuards(ProjectMemberGuard)
	@Get(':projectId/members')
	getMembers(@Param('projectId', ParseIntPipe) projectId: number) {
		return this.membersService.getMembers(projectId);
	}

	@UseGuards(ProjectMemberGuard, ProjectAdminGuard)
	@Post(':projectId/members')
	addMember(
		@Param('projectId', ParseIntPipe) projectId: number,
		@Body() dto: AddProjectMemberDto,
	) {
		return this.membersService.addMember(projectId, dto);
	}

	@UseGuards(ProjectMemberGuard, ProjectAdminGuard)
	@Put(':projectId/members/:userId')
	updateMemberRole(
		@Param('projectId', ParseIntPipe) projectId: number,
		@Param('userId', ParseIntPipe) userId: number,
		@Body() dto: UpdateProjectMemberRoleDto,
	) {
		return this.membersService.updateRole(projectId, userId, dto);
	}

	@UseGuards(ProjectMemberGuard, ProjectAdminGuard)
	@Delete(':projectId/members/:userId')
	removeMember(
		@Param('projectId', ParseIntPipe) projectId: number,
		@Param('userId', ParseIntPipe) userId: number,
	) {
		return this.membersService.removeMember(projectId, userId);
	}

	@UseGuards(ProjectMemberGuard)
	@Get(':projectId/activity')
	getActivity(@Param('projectId', ParseIntPipe) projectId: number) {
		return this.activityService.getActivity(projectId);
	}
}