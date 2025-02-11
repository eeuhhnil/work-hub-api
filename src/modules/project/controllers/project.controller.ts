import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProjectMemberService, ProjectService } from "../services";
import { AuthUser } from "../../../common/auth/decorators";
import { AuthPayload } from "../../../common/auth/types";
import { CreateProjectDto } from "../dtos/create-project.dto";

@Controller("project")
@ApiTags("project")
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create project" })
  async createProject(@Param("spaceId") spaceId: string, @AuthUser() authUser: AuthPayload, @Body() body: CreateProjectDto) {
    return this.projectService.createProject(spaceId, authUser.sub, body);
  }

  // @Delete(':id')
  // async deleteProject(){}
}
