import {ForbiddenException, Injectable} from "@nestjs/common";
import {DbService} from "../../../common/db/db.service";
import {IdLike} from "../../../common/types";
import {ProjectRole} from "../../../common/enums";

@Injectable()
export class ProjectMemberService {
  constructor(
    private readonly db: DbService,
  ) {
  }

  async checkMembership(projectId: IdLike<string>, memberId: IdLike<string>) {
    const membership = await this.db.projectMember.findOne({project: projectId, user: memberId})
    if (!membership) throw new ForbiddenException(`Permission denied project membership`)
    return membership
  }

  async checkOwnership(projectId: IdLike<string>, ownerId: IdLike<string>) {
    const ownership = await this.db.projectMember.findOne({
      project: projectId,
      user: ownerId,
      role: ProjectRole.OWNER
    })
    if (!ownership) throw new ForbiddenException(`Permission denied project ownership`)

    return ownership
  }
}