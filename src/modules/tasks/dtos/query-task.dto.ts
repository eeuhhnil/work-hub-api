import {ApiProperty, OmitType} from "@nestjs/swagger";
import {IsMongoId, IsNotEmpty} from "class-validator";

export class QueryTaskDto{
    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    space: string

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    project: string
}