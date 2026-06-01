import { Module } from '@nestjs/common';

import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

import { PrismaModule } from '../prisma/prisma.module';

import { ProjectMemberGuard } from '../projects/guards/project-member.guard';
import { ProjectWriteGuard } from '../projects/guards/project-write.guard';

@Module({
  imports: [PrismaModule],
  controllers: [IssuesController],
  providers: [IssuesService, ProjectMemberGuard, ProjectWriteGuard],
})
export class IssuesModule {}
