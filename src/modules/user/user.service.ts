import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../common/modules/database/database.service'
import { CreateUserDto } from './dto';
import { User } from './models';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
  ) {
  }

  async create(dto: CreateUserDto): Promise<Omit<User, '_id'>> {
    return this.db.user.create(dto)
  }
}
