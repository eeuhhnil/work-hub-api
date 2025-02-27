import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel } from "mongoose";
import {Project, ProjectMember, Space, SpaceMember, Task, User} from "./models";

@Injectable()
export class DbService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DbService.name);

  user: PaginateModel<User>;
  space: PaginateModel<Space>;
  spaceMember: PaginateModel<SpaceMember>;
  project: PaginateModel<Project>;
  projectMember: PaginateModel<ProjectMember>;
  task: PaginateModel<Task>;

  constructor(
    @InjectModel("User") private userModel: PaginateModel<User>,
    @InjectModel("Space") private spaceModel: PaginateModel<Space>,
    @InjectModel("SpaceMember") private spaceMemberModel: PaginateModel<SpaceMember>,
    @InjectModel("Project") private projectModel: PaginateModel<Project>,
    @InjectModel("ProjectMember") private projectMemberModel: PaginateModel<ProjectMember>,
    @InjectModel("Task") private taskModel: PaginateModel<Task>,
  ) {
    this.user = userModel;
    this.space = spaceModel;
    this.spaceMember = spaceMemberModel;
    this.project = projectModel;
    this.projectMember = projectMemberModel;
    this.task = taskModel;
  }

  onApplicationBootstrap(): any {
    const startTime = new Date().getTime();

    this.runMigrations().then(() => {
      this.logger.log(`Took ${~~((new Date().getTime() - startTime) / 100) / 10}s to migrate.`);
    });
  }

  async runMigrations() {}
}
