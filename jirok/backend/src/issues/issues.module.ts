import { Module } from '@nestjs/common';

import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

import { PrismaModule } from '../prisma/prisma.module';
import { ProjectRealtimeModule } from '../realtime/project-realtime.module';

import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { ProjectAdminGuard } from '../projects/guards/project-admin.guard';
import { ProjectWriteGuard } from '../projects/guards/project-write.guard';

@Module({
  imports: [PrismaModule, ProjectRealtimeModule],
  controllers: [IssuesController],
  providers: [
    IssuesService,
    ProjectMemberGuard,
    ProjectAdminGuard,
    ProjectWriteGuard,
  ],
})
export class IssuesModule {}
