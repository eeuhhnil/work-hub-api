import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../common/modules/database/database.service'
import { CreateUserDto } from './dto';
import { User } from './models';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
  ) {
  }

  async create(dto: CreateUserDto): Promise<Omit<User, '_id'>> {
    return this.db.user.create(dto)
  }

  async findByEmail(email: string) {
    return this.db.user.findOne({ email: email })
  }

  async findByGoogleId(googleId: string) {
    return this.db.user.findOne({ googleId: googleId })
  }

  async exist(filter: FilterQuery<User>) {
    return this.db.user.exists(filter)
  }
}
