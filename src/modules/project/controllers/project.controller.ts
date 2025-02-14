import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ProjectMemberService, ProjectService } from "../services";
import { Controller } from "@nestjs/common";

@Controller("project")
@ApiTags("project")
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService
  ) {}
}
