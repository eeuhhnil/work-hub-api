import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
  @ApiProperty({
    example: "project",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "project description",
  })
  @IsString()
  @IsNotEmpty()
  desc: string;
}
