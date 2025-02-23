import {ApiPropertyOptional, PartialType} from "@nestjs/swagger";
import {CreateSpaceDto} from "./create-space.dto";
import {SpaceRole} from "../../../common/enums";
import {IsEnum, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class QuerySpacesDto extends PartialType(CreateSpaceDto){
  @ApiPropertyOptional()
  @IsEnum(SpaceRole)
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
    return value
  })
  role?: SpaceRole
}