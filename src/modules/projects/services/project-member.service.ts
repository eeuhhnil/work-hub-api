import {ForbiddenException, Injectable} from "@nestjs/common";
import {DbService} from "../../../common/db/db.service";
import {IdLike} from "../../../common/types";
import {ProjectRole} from "../../../common/enums";
import {ProjectMember} from "../../../common/db/models";
import {QueryProjectMemberDto} from "../dtos";
import {PaginationDto} from "../../../common/dtos";
import {FilterQuery, PaginateOptions} from "mongoose";

@Injectable()
export class ProjectMemberService {
  constructor(
    private readonly db: DbService,
  ) {
  }

  async findOne(projectMemberId: IdLike<string>) {
    return this.db.projectMember.findOne({_id: projectMemberId})
  }

  async findMany(query: QueryProjectMemberDto, paginationDto: PaginationDto) {
    const {project} = query
    const filter: FilterQuery<ProjectMember> = {}
    if (project) filter.project = project

    const {page, limit, sortBy='createdAt', sortType='desc'} = paginationDto
    const options: PaginateOptions = {
      page,
      limit,
      sort: {[sortBy]: sortType === 'asc' ? 1 : -1},
      populate: 'user'
    }

    return this.db.projectMember.paginate(filter, options)
  }

  async addMemberToProject(payload: Omit<ProjectMember, '_id'>) {
    return this.db.projectMember.create(payload)
  }

  async deleteOne(projectMemberId: IdLike<string>) {
    return this.db.projectMember.deleteOne({_id: projectMemberId})
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