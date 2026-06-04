import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

import { ProjectApiErrorResponseDto } from '../dto/projects-swagger.dto';
import { ProjectWriteGuard } from '../guards/project-write.guard';

export const ProjectWriteOnly = applyDecorators(
  UseGuards(ProjectWriteGuard),
  ApiForbiddenResponse({
    description: 'Write access required',
    type: ProjectApiErrorResponseDto,
  }),
);
