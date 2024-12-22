import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SpaceRole } from '../enums';

export class GetSpaceDto {
  @ApiPropertyOptional({ enum: SpaceRole })
  @IsEnum(SpaceRole)
  @IsOptional()
  role?: SpaceRole
}