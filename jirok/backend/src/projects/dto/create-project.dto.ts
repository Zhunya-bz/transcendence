import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	name: string;
}