import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectActivityService {
	constructor(private prisma: PrismaService) {}

	async getActivity(projectId: number) {
		const issues = await this.prisma.issue.groupBy({
			by: ['status'],
			where: {
				projectId,
				deletedAt: null,
			},
			_count: true,
		});

		return issues;
	}
}