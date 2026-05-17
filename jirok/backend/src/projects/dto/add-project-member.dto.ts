import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma';
import { IsEnum, IsInt } from 'class-validator';

export class AddProjectMemberDto {
	@ApiProperty()
	@IsInt()
	userId: number;

	@ApiProperty({ enum: UserRole })
	@IsEnum(UserRole)
	role: UserRole;
}