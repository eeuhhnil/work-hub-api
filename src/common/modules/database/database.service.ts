import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../modules/user/models';
import { BaseRepository } from './base.repository';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap{
  user: BaseRepository<User>

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.user = new BaseRepository<User>(this.userModel)
  }

  onApplicationBootstrap() {
    this.runMigrations().then(() => {
      console.log('Database migrated!')
    })
  }

  async runMigrations() {}
}