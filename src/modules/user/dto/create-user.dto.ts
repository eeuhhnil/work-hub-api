import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  fullName: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  password?: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  googleId?: string
}