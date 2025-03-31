import {DbService} from "../../../common/db/db.service";
import {Injectable} from "@nestjs/common";
import {IdLike} from "../../../common/types";
import {Project, Task} from "../../../common/db/models";
import {QueryTaskDto} from "../dtos";
import {PaginationDto} from "../../../common/dtos";
import {FilterQuery, PaginateOptions} from "mongoose";
import {QueryProjectDto} from "../../projects/dtos";

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

  async findMany(
      userId: string,
      query: QueryTaskDto,
      paginationDto: PaginationDto
  ){
    const filter: FilterQuery<Task> = {
      $or: [
        { owner: userId },
        { assignee: userId }
      ]
    };

    // Apply filters from query
    const { project, space } = query;

    if (project) filter.project = project;
    if (space) filter.space = space;

    // Pagination options
    const { page = 1, limit = 10, sortBy = 'createdAt', sortType = 'desc' } = paginationDto;
    const options = {
      page,
      limit,
      sort: { [sortBy]: sortType === 'asc' ? 1 : -1 },
      populate: "assignee"
    };

    return this.db.task.paginate(filter, options);
  }

  async updateOne(taskId: IdLike<string>, payload: Partial<Omit<Task, '_id'>>) {
    return this.db.task.findOneAndUpdate({_id: taskId}, payload, {new: true})
  }

  async deleteOne(taskId: IdLike<string>) {
    return this.db.task.deleteOne({_id: taskId})
  }
}