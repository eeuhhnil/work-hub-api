import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from "mongoose";
import { User } from './models';

@Injectable()
export class DbService implements OnApplicationBootstrap{
  private readonly logger = new Logger(DbService.name)

  user: PaginateModel<User>

  constructor(
    @InjectModel('User') private userModel: PaginateModel<User>
  ) {
    this.user = userModel
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