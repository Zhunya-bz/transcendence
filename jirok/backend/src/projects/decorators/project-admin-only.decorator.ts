import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { ApiErrorResponseDto } from '../dto/projects-swagger.dto';
import { ProjectAdminGuard } from '../guards/project-admin.guard';
import { ProjectMemberGuard } from '../guards/project-member.guard';

export const ProjectAdminOnly = applyDecorators(
  UseGuards(ProjectMemberGuard, ProjectAdminGuard),
  ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  }),
  ApiForbiddenResponse({
    description: 'Admin access required',
    type: ApiErrorResponseDto,
  }),
);
