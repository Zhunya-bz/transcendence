import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class AddProjectMemberDto {
	@ApiProperty({
		example: 5,
		description: 'User ID to add to the project',
	})
	@IsInt()
	userId: number;

	@ApiProperty({
		enum: UserRole,
		enumName: 'UserRole',
		example: UserRole.Member,
		description: 'Role assigned to the user in this project',
	})
	@IsEnum(UserRole)
	role: UserRole;
}