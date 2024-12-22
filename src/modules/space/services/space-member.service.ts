import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from "../../../common/db/db.service";
import { IdLike } from "../../../common/types";
import { SpaceRole } from "../enums";
import mongoose from "mongoose";

@Injectable()
export class SpaceMemberService {
  constructor(private readonly db: DbService) {}

  async addMemberToSpace(
    ownerId: IdLike<string>,
    spaceId: IdLike<string>,
    memberId: IdLike<string>,
    role: SpaceRole = SpaceRole.Member,
  ) {
    await this.checkOwnership(spaceId, ownerId)

    const [space, member, exists] = await Promise.all([
      this.db.space.exists({_id: spaceId}),
      this.db.spaceMember.exists({_id: memberId}),
      this.db.spaceMember.exists({
        space: spaceId,
        user: memberId,
      }),
    ])
    if (!space) throw new NotFoundException('SPACE_ID_NOT_FOUND')
    if (!member) throw new NotFoundException('MEMBER_ID_NOT_FOUND')
    if (exists) throw new ConflictException('ALREADY_MEMBERSHIP')

    return this.db.spaceMember.create({
      userId: memberId,
      space: spaceId,
      role: role,
    })
  }

  async removeMemberFromSpace(
    ownerId: IdLike<string>,
    spaceId: IdLike<string>,
    memberId: IdLike<string>,
  ) {
    await this.checkOwnership(spaceId, ownerId)

    return this.db.spaceMember.deleteOne({
      space: spaceId,
      user: memberId,
    })
  }

  async getMember(spaceId: IdLike<string>, userId: IdLike<string>) {
    return this.db.spaceMember.findOne({
      space: spaceId,
      user: userId,
    })
  }

  async getMembers(spaceId: IdLike<string>, role: SpaceRole = SpaceRole.Member) {
    return this.db.spaceMember.find({
      space: spaceId,
      role: role,
    })
  }
  
  async checkOwnership(spaceId: IdLike<string>, userId: IdLike<string>) {
    const owner = await this.db.spaceMember.exists({
      space: spaceId as mongoose.Types.ObjectId,
      user: userId as mongoose.Types.ObjectId,
      role: SpaceRole.Owner,
    })
    if (!owner) throw new ForbiddenException('NOT_SPACE_OWNER')

    return owner
  }

  async checkMembership(spaceId: IdLike<string>, userId: IdLike<string>) {
    const member = await this.db.spaceMember.exists({
      space: spaceId,
      user: userId,
      role: SpaceRole.Member,
    })
    if (!member) throw new ForbiddenException('NOT_SPACE_MEMBER')

    return member
  }
}