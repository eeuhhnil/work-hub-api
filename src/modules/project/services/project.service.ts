import { Injectable } from "@nestjs/common";
import { DbService } from "src/common/db/db.service";
import { IdLike } from "src/common/types";
import { CreateProjectDto } from "../dtos/create-project.dto";
import mongoose from "mongoose";
import { ProjectRole } from "../enums";

@Injectable()
export class ProjectService {
  constructor(private db: DbService) {}

  async createProject(spaceId: IdLike<string>, userId: IdLike<string>, body: CreateProjectDto) {
    const project = await this.db.project.create({
      space: spaceId,
      ...body,
    });

    await this.db.projectMember.create({
      project: project._id,
      user: new mongoose.Types.ObjectId(userId),
      roles: ProjectRole.Owner,
    });
    return project.toJSON();
  }
}
