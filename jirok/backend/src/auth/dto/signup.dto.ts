import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class SignupDto {
    @ApiProperty({ description: 'Name of the user' })
    @IsString()
    @MinLength(1)
    name: string;
    
    @ApiProperty({ description: 'Email of the user', example: 'this@that.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password of the user', example: 'password123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional({ description: 'Surname of the user' })
    @IsOptional()
    @IsString()
    surname?: string;
}
