import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateProjectMemberRoleDto {
	@ApiProperty({
		enum: UserRole,
		enumName: 'UserRole',
		example: UserRole.Admin,
		description: 'New role for the project member',
	})
	@IsEnum(UserRole)
	role: UserRole;
}