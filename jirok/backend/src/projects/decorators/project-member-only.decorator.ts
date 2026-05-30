import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ApiErrorResponseDto } from '../dto/projects-swagger.dto';
import { ProjectMemberGuard } from '../guards/project-member.guard';

export const ProjectMemberOnly = applyDecorators(
  UseGuards(ProjectMemberGuard),
  ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
    type: ApiErrorResponseDto,
  }),
  ApiNotFoundResponse({
    description: 'Project not found or user is not a member',
    type: ApiErrorResponseDto,
  }),
);
