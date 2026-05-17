import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma';
import { IsEnum } from 'class-validator';

export class UpdateProjectMemberRoleDto {
	@ApiProperty({ enum: UserRole })
	@IsEnum(UserRole)
	role: UserRole;
}