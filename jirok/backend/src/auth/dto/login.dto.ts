import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'The email address of user', example: 'this@that.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of user', example: 'password123', minLength: 1 })
    @IsString()
    @MinLength(1)
    password: string;
}