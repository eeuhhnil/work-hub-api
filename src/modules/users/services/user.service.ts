import {Injectable, NotFoundException} from "@nestjs/common";
import {DbService} from "../../../common/db/db.service";
import {IdLike} from "../../../common/types";
import {QueryUsersDto, UpdateProfileDto} from "../dtos";
import {PaginationDto} from "../../../common/dtos";
import {FilterQuery, PaginateOptions} from "mongoose";
import {User} from "../../../common/db/models";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly db: DbService,
  ) {
  }

  async getProfile(userId: IdLike<string>) {
    return this.db.user.findById(userId)
  }

  async updateProfile(userId: IdLike<string>, payload: UpdateProfileDto) {
    const existingUser = await this.db.user.exists({_id: userId})
    if (!existingUser) throw new NotFoundException('User not found')

    const {password, ...userInfo} = payload

    return this.db.user.findOneAndUpdate(
      {_id: userId},
      {
        password: password ? bcrypt.hashSync(password, 10) : undefined,
        ...userInfo,
      },
      {new: true})
  }

  async findUserByEmail(email: IdLike<string>) {
    return this.db.user.findOne({email})
  }

  async findMany(query: QueryUsersDto, pagination: PaginationDto) {
    const {username, email, fullName} = query
    const filter: FilterQuery<User> = {}
    if (username) filter.username = {$regex: username, $options: "i"}
    if (email) filter.email = {$regex: email, $options: "i"}
    if (fullName) filter.fullName = {$regex: fullName, $options: "i"}

    const {page, limit, sortBy='createdAt', sortType='desc'} = pagination
    const options: PaginateOptions = {
      page,
      limit,
      sort: {[sortBy]: sortType === 'asc' ? 1 : -1}
    }

    return this.db.user.paginate(filter, options)
  }

  async deleteOne(userId: IdLike<string>) {
    return this.db.user.deleteOne({_id: userId})
  }

  async checkExistingUser(userId: IdLike<string>) {
    const user = await this.db.user.exists({_id: userId})
    if (!user) throw new NotFoundException('User not found')

    return user
  }
}