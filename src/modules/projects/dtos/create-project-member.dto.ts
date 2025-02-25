import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {ProjectRole} from "../../../common/enums";
import {IsEnum, IsMongoId, IsNotEmpty, IsOptional} from "class-validator";

export class CreateProjectMemberDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  project: string

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  user: string

  @ApiPropertyOptional()
  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole
}