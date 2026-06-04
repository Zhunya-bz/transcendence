import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import {
  ProjectApiErrorResponseDto,
  ProjectActivityCountMapDto,
  ProjectDetailResponseDto,
  ProjectMemberResponseDto,
  ProjectMyRoleResponseDto,
  ProjectResponseDto,
} from '../dto/projects-swagger.dto';
import { AddProjectMemberByEmailDto } from '../dto/add-project-member-by-email.dto';
import { AddProjectMemberByIdDto } from '../dto/add-project-member-by-id.dto';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { UpdateProjectMemberRoleDto } from '../dto/update-project-member-role.dto';

export const ApiFindAllProjects = applyDecorators(
  ApiOperation({ summary: 'List projects for the authenticated user' }),
  ApiOkResponse({ type: ProjectResponseDto, isArray: true }),
);

export const ApiCreateProject = applyDecorators(
  ApiOperation({ summary: 'Create a new project' }),
  ApiBody({ type: CreateProjectDto }),
  ApiCreatedResponse({ type: ProjectResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ProjectApiErrorResponseDto,
  }),
);

export const ApiGetProject = applyDecorators(
  ApiOperation({ summary: 'Get one project by ID' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiOkResponse({ type: ProjectDetailResponseDto }),
);

export const ApiUpdateProject = applyDecorators(
  ApiOperation({ summary: 'Update a project' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiBody({ type: UpdateProjectDto }),
  ApiOkResponse({ type: ProjectResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ProjectApiErrorResponseDto,
  }),
);

export const ApiRemoveProject = applyDecorators(
  ApiOperation({ summary: 'Soft delete a project' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiOkResponse({ type: ProjectResponseDto }),
);

export const ApiGetProjectMembers = applyDecorators(
  ApiOperation({ summary: 'List project members' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiOkResponse({ type: ProjectMemberResponseDto, isArray: true }),
);

export const ApiAddProjectMemberById = applyDecorators(
  ApiOperation({ summary: 'Add a member to a project' }),
  ApiBody({ type: AddProjectMemberByIdDto }),
  ApiCreatedResponse({ type: ProjectMemberResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ProjectApiErrorResponseDto,
  }),
);

export const ApiAddProjectMemberByEmail = applyDecorators(
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiOperation({ summary: 'Add a member to a project by email' }),
  ApiBody({ type: AddProjectMemberByEmailDto }),
  ApiCreatedResponse({ type: ProjectMemberResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ProjectApiErrorResponseDto,
  }),
);

export const ApiGetProjectMyRole = applyDecorators(
  ApiOperation({ summary: 'Get the authenticated user role in a project' }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiOkResponse({ type: ProjectMyRoleResponseDto }),
);

export const ApiUpdateProjectMemberRole = applyDecorators(
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiParam({ name: 'userId', type: Number, example: 5 }),
  ApiOperation({ summary: 'Update a project member role' }),
  ApiBody({ type: UpdateProjectMemberRoleDto }),
  ApiOkResponse({ type: ProjectMemberResponseDto }),
  ApiBadRequestResponse({
    description: 'Validation error in request body',
    type: ProjectApiErrorResponseDto,
  }),
);

export const ApiRemoveProjectMember = applyDecorators(
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiParam({ name: 'userId', type: Number, example: 5 }),
  ApiOperation({ summary: 'Remove a member from a project' }),
  ApiOkResponse({ type: ProjectMemberResponseDto }),
  ApiBadRequestResponse({
    description: 'Cannot remove the last admin from project',
    type: ProjectApiErrorResponseDto,
  }),
);

export const ApiGetProjectActivity = applyDecorators(
  ApiOperation({
    summary:
      'Get issue activity counts grouped by status, type, priority, and assignee for a project',
  }),
  ApiParam({ name: 'projectId', type: Number, example: 12 }),
  ApiOkResponse({ type: ProjectActivityCountMapDto }),
);
