import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ProjectApiErrorResponseDto } from '../dto/projects-swagger.dto';
import { ProjectAdminGuard } from '../guards/project-admin.guard';
import { ProjectMemberGuard } from '../guards/project-member.guard';

export const ProjectAdminOnly = applyDecorators(
  UseGuards(ProjectMemberGuard, ProjectAdminGuard),
  ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
    type: ProjectApiErrorResponseDto,
  }),
  ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ProjectApiErrorResponseDto,
  }),
  ApiForbiddenResponse({
    description: 'Admin access required',
    type: ProjectApiErrorResponseDto,
  }),
);
