import { Injectable } from '@nestjs/common';
import { DbService } from '../../../common/db/db.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly db: DbService,
  ) {
  }
}