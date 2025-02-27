import {OmitType} from "@nestjs/swagger";
import {UpdateTaskDto} from "./update-task.dto";

export class QueryTaskDto extends OmitType(
  UpdateTaskDto,
  ['description'] as const,
) {
}