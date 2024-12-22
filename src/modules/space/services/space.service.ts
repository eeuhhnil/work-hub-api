import { Injectable } from '@nestjs/common';
import { IdLike } from '../../../common/types';
import { CreateSpaceDto, GetSpaceDto } from '../dtos';
import { DbService } from '../../../common/db/db.service';
import { SpaceRole } from '../enums';
import { PaginationDto } from '../../../common/dtos';
import mongoose, { FilterQuery, PaginateOptions } from 'mongoose';
import { SpaceMember } from '../../../common/db/models';

@Injectable()
export class SpaceService {
  constructor(
    private db: DbService,
  ) {
  }

  async createSpace(userId: IdLike<string>, body: CreateSpaceDto) {
    const space = await this.db.space.create({
      ...body,
    })

    await this.db.spaceMember.create({
      space: space._id,
      user: new mongoose.Types.ObjectId(userId),
      role: SpaceRole.Owner,
    })

    return space.toJSON()
  }

  async getSpaces(
    userId: IdLike<string>,
    query: GetSpaceDto,
    pagination: PaginationDto,
  ) {
    const { role } = query

    const spaceMemberFilter: FilterQuery<SpaceMember> = {
      user: userId
    }
    if (role === SpaceRole.Owner) {
      spaceMemberFilter.role = SpaceRole.Owner
    } else if (role === SpaceRole.Member) {
      spaceMemberFilter.role = SpaceRole.Member
    }

    const { page, limit, sortBy= 'createAt', sortType= 'desc' } = pagination
    const options: PaginateOptions = {
      page,
      limit,
      sort: {[sortBy]: sortType === 'asc' ? 1 : -1},
      populate: 'space',
    }

    const paginationResult = await this.db.spaceMember.paginate(spaceMemberFilter, options)
    const spaces = paginationResult.docs.map((spaceMember: any) => spaceMember.space)

    return {
      data: spaces.map(space => space.toJSON()),
      _pagination: paginationResult
    }
  }

  async deleteSpace(spaceId: IdLike<string>) {
    return this.db.space.deleteOne({
      _id: spaceId,
    })
  }
}