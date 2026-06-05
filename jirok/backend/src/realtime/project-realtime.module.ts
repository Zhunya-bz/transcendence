import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectRealtimeService } from './project-realtime.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
    }),
  ],
  providers: [ProjectRealtimeService],
  exports: [ProjectRealtimeService],
})
export class ProjectRealtimeModule {}
