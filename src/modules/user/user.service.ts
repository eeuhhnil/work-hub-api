import { Injectable } from '@nestjs/common'
import { DbService } from '../../common/db/db.service';
import { CreateUserDto } from './dto';
import { FilterQuery } from 'mongoose';
import { User } from '../../common/db/models';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DbService,
  ) {
  }

  async createUser(payload: CreateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.db.user.create(payload)
    const { password, ...safeUser } = user.toJSON()

    return safeUser
  }

  async findOne(filter: FilterQuery<User>) {
    return this.db.user.findOne(filter)
  }

  async exists(filter: FilterQuery<User>) {
    return this.db.user.exists(filter)
  }
}