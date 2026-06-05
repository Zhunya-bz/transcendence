import { Module } from '@nestjs/common';

import { ProjectsController } from './projects.controller';

import { ProjectsService } from './services/projects.service';
import { ProjectMembersService } from './services/project-members.service';
import { ProjectActivityService } from './services/project-activity.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectRealtimeModule } from '../realtime/project-realtime.module';

import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';
import { ProjectWriteGuard } from './guards/project-write.guard';

@Module({
  imports: [PrismaModule, ProjectRealtimeModule],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectMembersService,
    ProjectActivityService,
    ProjectMemberGuard,
    ProjectAdminGuard,
    ProjectWriteGuard,
  ],
})
export class ProjectsModule {}
