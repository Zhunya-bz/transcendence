import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { ProjectsController } from './projects.controller';

import { ProjectsService } from './services/projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectActivityService } from './services/project-activity.service';

import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';

@Module({
  controllers: [ProjectsController],
  providers: [
    PrismaService,
    ProjectsService,
    ProjectMembersService,
    ProjectActivityService,
    ProjectMemberGuard,
    ProjectAdminGuard,
  ],
})
export class ProjectsModule {}
