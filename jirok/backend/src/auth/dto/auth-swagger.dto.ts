import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthTokensResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;
}

export class ApiKeyResponseDto {
  @ApiProperty({ example: '95f4a7b2c3d4e5f6...' })
  apiKey!: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 5 })
  id!: number;

  @ApiProperty({ example: 'Alexis' })
  name!: string;

  @ApiPropertyOptional({ example: 'Lopez', nullable: true })
  surname?: string | null;

  @ApiProperty({ example: 'alexis@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'Engineer' })
  jobTitle?: string | null;

  @ApiPropertyOptional({ example: 'ACME Corp' })
  jobOrganization?: string | null;

  @ApiPropertyOptional({ example: 'Berlin, Germany' })
  location?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  avatarUrl?: string | null;

  @ApiProperty({ example: '2026-05-21T10:15:30.000Z' })
  accountCreated!: Date;

  @ApiProperty({ example: '2026-05-21T10:15:30.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ example: null, nullable: true })
  deletedAt?: Date | null;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'User not found' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['email should be an email'],
      },
    ],
  })
  message!: string | string[];

  @ApiProperty({ example: 'Not Found' })
  error!: string;
}
