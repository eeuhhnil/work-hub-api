import {ApiPropertyOptional} from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class QueryUsersDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fullName?: string
}