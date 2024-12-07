import {
  Model,
  AggregateOptions,
  FilterQuery,
  HydratedDocument,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  Aggregate,
} from 'mongoose'
import { PaginateOptions, PaginateResult } from './interfaces'

export class BaseRepository<T> {
  private repository: Model<T>

  constructor(repository: Model<T>) {
    this.repository = repository
  }

  async paginate(
    filter: FilterQuery<T>,
    options: PaginateOptions = {},
  ): Promise<PaginateResult<T>> {
    const { page = 1, limit = 10, sort = {}, projection = {} } = options
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.repository
        .find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.repository.countDocuments(filter).exec(),
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async exists(
    filter: FilterQuery<T>
  ) {
    return this.repository.exists(filter)
  }

  async findById(
    id: any,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T>> {
    return this.repository.findById(id, projection, options)
  }

  async findOne(
    filter: FilterQuery<T>,
    protection?: ProjectionType<T>,
    options?: QueryOptions
  ) {
    return this.repository.findOne(filter, protection, options)
  }

  async find(
    filter: FilterQuery<T>,
    protection?: ProjectionType<T>,
    options?: QueryOptions
  ) {
    return this.repository.find(filter, protection, options)
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update?: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ) {
    return this.repository.findOneAndUpdate(filter, update, options)
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ) {
    return this.repository.updateMany(filter, update)
  }

  async deleteOne(
    filter: FilterQuery<T>,
  ) {
    return this.repository.deleteOne(filter)
  }

  async deleteMany(
    filter: FilterQuery<T>
  ) {
    return this.repository.deleteMany(filter)
  }

  async create(
    item: Omit<T, '_id'>
  ): Promise<HydratedDocument<T>> {
    return this.repository.create(item)
  }

  async count(
    filter: FilterQuery<T>,
  ) {
    return this.repository.countDocuments(filter)
  }

  async aggregate(
    pipeline: PipelineStage[],
    options?: AggregateOptions
  ): Promise<Aggregate<any[]>> {
    return this.repository.aggregate(pipeline, options)
  }

  async insertMany(
    docs: Omit<T, '_id'>[]
  ) {
    return this.repository.insertMany(docs)
  }

  async getCollectionName() {
    return this.repository.collection.name
  }
}