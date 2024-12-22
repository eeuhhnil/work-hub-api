import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({
    example: 'space',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: 'space description',
  })
  @IsString()
  @IsNotEmpty()
  description: string
}