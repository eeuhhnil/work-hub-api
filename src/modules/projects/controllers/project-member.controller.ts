import {Controller} from "@nestjs/common";
import {ProjectMemberService} from "../services";

@Controller('project')
export class ProjectMemberController {
  constructor(
    private readonly projectMember: ProjectMemberService,
  ) {
  }
}