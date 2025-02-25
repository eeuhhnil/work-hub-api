import {Injectable} from "@nestjs/common";
import {DbService} from "../../../common/db/db.service";
import {CreateProjectDto, QueryProjectDto, UpdateProjectDto} from "../dtos";
import {IdLike} from "../../../common/types";
import {ProjectRole} from "../../../common/enums";
import {PaginationDto} from "../../../common/dtos";
import {FilterQuery, PaginateOptions} from "mongoose";
import {Project} from "../../../common/db/models";

@Injectable()
export class ProjectService {
  constructor(
    private readonly db: DbService,
  ) {
  }

  async createOne(ownerId: IdLike<string>, payload: CreateProjectDto) {
    const project = await this.db.project.create(payload)

    await this.db.projectMember.create({
      user: ownerId,
      project: project._id.toString(),
      role: ProjectRole.OWNER,
    })

    return project
  }

  async findMany(
    userId: IdLike<string>,
    query: QueryProjectDto,
    paginationDto: PaginationDto
  ) {
    const filter: FilterQuery<Project> = {}

    const projectMembers = await this.db.projectMember.find({ user: userId })
    const projectIds = projectMembers.map((sm) => sm.project)
    filter._id = { $in: projectIds }

    const {name, description, role} = query
    if (name) filter.name = {$regex: name, $options: "i"}
    if (description) filter.description = {$regex: description, $options: "i"}
    if (role) {
      const projectMembers = await this.db.projectMember.find({ user: userId, role: role })
      const projectIds = projectMembers.map((sm) => sm.project)
      filter._id = { $in: projectIds }
    }

    const {page, limit, sortBy='createdAt', sortType='desc'} = paginationDto
    const options: PaginateOptions = {
      page,
      limit,
      sort: {[sortBy]: sortType === 'asc' ? 1 : -1}
    }

    return this.db.project.paginate(filter, options)
  }

  async findOne(projectId: IdLike<string>) {
    return this.db.project.findById(projectId)
  }

  async updateOne(projectId: IdLike<string>, payload: UpdateProjectDto) {
    return this.db.project.findOneAndUpdate(
      {_id: projectId },
      {
        ...payload,
      },
      {new: true})
  }

  async deleteOne(projectId: IdLike<string>) {
    return this.db.project.deleteOne({_id: projectId})
  }
}