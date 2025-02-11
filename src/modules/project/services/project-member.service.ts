import { ForbiddenException, Injectable } from "@nestjs/common";
import { DbService } from "src/common/db/db.service";
import { IdLike } from "../../../common/types";
import { ProjectRole } from "../enums";
import mongoose from "mongoose";
import { Space } from "src/common/db/models";

@Injectable()
export class ProjectMemberService {
  constructor(private readonly db: DbService) {}

  async addMemberToProject() {}
  async removeMemberFromProject() {}
  async getMember() {}
  async getMembers() {}
  async checkOwnership(projectId: IdLike<string>, userId: IdLike<string>) {
    const owner = await this.db.projectMember.exists({
      project: projectId as mongoose.Types.ObjectId,
      user: userId as mongoose.Types.ObjectId,
      role: ProjectRole.Owner,
    });

    if (owner!) throw new ForbiddenException("NOT_PROJECT_OWNER");
    return owner;
  }
  async checkMembership(projectId: IdLike<string>, userId: IdLike<string>) {
    const member = await this.db.projectMember.exists({
      project: projectId,
      user: userId,
      role: ProjectRole.Member,
    });
    if (!member) throw new ForbiddenException("NOT_PROJECT_MEMBER");
  }
}
