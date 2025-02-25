import {ApiPropertyOptional, PartialType} from "@nestjs/swagger";
import {CreateProjectDto} from "./create-project.dto";
import {ProjectRole, SpaceRole} from "../../../common/enums";
import {IsEnum, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class QueryProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional()
  @IsEnum(SpaceRole)
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
    return value
  })
  role?: ProjectRole
}