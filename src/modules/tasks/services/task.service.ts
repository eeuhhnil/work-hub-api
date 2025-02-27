import {DbService} from "../../../common/db/db.service";
import {Injectable} from "@nestjs/common";
import {IdLike} from "../../../common/types";
import {Task} from "../../../common/db/models";

@Injectable()
export class TaskService {
  constructor(
    private readonly db: DbService
  ) {
  }

  async createOne(payload: Omit<Task, "_id">) {
    return this.db.task.create(payload)
  }

  async findOne(taskId: IdLike<string>) {
    return this.db.task.findById(taskId)
  }

  async updateOne(taskId: IdLike<string>, payload: Partial<Omit<Task, '_id'>>) {
    return this.db.task.findOneAndUpdate({_id: taskId}, payload, {new: true})
  }

  async deleteOne(taskId: IdLike<string>) {
    return this.db.task.deleteOne({_id: taskId})
  }
}