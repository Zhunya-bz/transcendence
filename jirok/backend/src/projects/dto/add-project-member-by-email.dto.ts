import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';

export class AddProjectMemberByEmailDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'The unique email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
    example: UserRole.Member,
    description: 'Role assigned to the user in this project',
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
