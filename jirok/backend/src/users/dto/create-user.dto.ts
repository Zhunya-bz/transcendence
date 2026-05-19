import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'The first name of the user '})
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({ description: 'The unique email of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'The password of the user (it will be hashed)', minLength: 8 })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    passwordHash: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @MaxLength(100)
    surname?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @MaxLength(100)
    jobTitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @MaxLength(100)
    jobOrganization?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    @MaxLength(100)
    location?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatarUrl?: string;
}
