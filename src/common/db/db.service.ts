import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from "mongoose";
import { Space, SpaceMember, User } from './models';

@Injectable()
export class DbService implements OnApplicationBootstrap{
  private readonly logger = new Logger(DbService.name)

  user: PaginateModel<User>
  space: PaginateModel<Space>
  spaceMember: PaginateModel<SpaceMember>

  constructor(
    @InjectModel('User') private userModel: PaginateModel<User>,
    @InjectModel('Space') private spaceModel: PaginateModel<Space>,
    @InjectModel('SpaceMember') private spaceMemberModel: PaginateModel<SpaceMember>,
  ) {
    this.user = userModel
    this.space = spaceModel
    this.spaceMember = this.spaceMemberModel
  }

  onApplicationBootstrap(): any {
    const startTime = new Date().getTime()

    this.runMigrations().then(() => {
      this.logger.log(
        `Took ${~~((new Date().getTime() - startTime) / 100) / 10}s to migrate.`,
      )
    })
  }

  async runMigrations() {
  }
}