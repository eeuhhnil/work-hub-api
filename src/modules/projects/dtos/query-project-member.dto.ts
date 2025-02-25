import {ApiProperty} from "@nestjs/swagger";
import {IsMongoId, IsNotEmpty} from "class-validator";

export class QueryProjectMemberDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  project: string
}