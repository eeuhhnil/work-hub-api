import {Injectable, NotFoundException} from "@nestjs/common";
import {DbService} from "../../../common/db/db.service";
import {IdLike} from "../../../common/types";
import {CreateSpaceDto, QuerySpacesDto, UpdateSpaceDto} from "../dtos";
import {SpaceRole} from "../../../common/enums";
import {PaginationDto} from "../../../common/dtos";
import {FilterQuery, PaginateOptions} from "mongoose";
import {Space} from "../../../common/db/models";

@Injectable()
export class SpaceService {
  constructor(
    private readonly db: DbService,
  ) {
  }

  async createOne(ownerId: IdLike<string>, payload: CreateSpaceDto) {
    const existingUser = this.db.user.exists({_id: ownerId})
    if (!existingUser) throw new NotFoundException(`User with id ${ownerId} does not exist`)

    const space = await this.db.space.create(payload)
    await this.db.spaceMember.create({
      space: space._id.toString(),
      user: ownerId,
      role: SpaceRole.OWNER,
    })

    return space
  }

  async findMany(
    userId: IdLike<string>,
    query: QuerySpacesDto,
    paginationDto: PaginationDto
  ) {
    const filter: FilterQuery<Space> = {}

    const spaceMembers = await this.db.spaceMember.find({ user: userId })
    const spaceIds = spaceMembers.map((sm) => sm.space)
    filter._id = { $in: spaceIds }

    const {name, description, role} = query
    if (name) filter.name = {$regex: name, $options: "i"}
    if (description) filter.description = {$regex: description, $options: "i"}
    if (role) {
      const spaceMembers = await this.db.spaceMember.find({ user: userId, role: role })
      const spaceIds = spaceMembers.map((sm) => sm.space)
      filter._id = { $in: spaceIds }
    }

    const {page, limit, sortBy='createdAt', sortType='desc'} = paginationDto
    const options: PaginateOptions = {
      page,
      limit,
      sort: {[sortBy]: sortType === 'asc' ? 1 : -1}
    }

    return this.db.space.paginate(filter, options)
  }

  async findOne(spaceId: IdLike<string>) {
    return this.db.space.findById(spaceId)
  }

  async updateOne(spaceId: IdLike<string>, payload: UpdateSpaceDto) {
    return this.db.space.findOneAndUpdate(
      {_id: spaceId.toString()},
      {
        ...payload,
      },
      {new: true})
  }

  async deleteOne(spaceId: IdLike<string>) {
    await this.db.spaceMember.deleteMany({space: spaceId})

    return this.db.space.deleteOne({_id: spaceId})
  }
}