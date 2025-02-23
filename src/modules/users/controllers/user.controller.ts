import {Body, Controller, Delete, Get, NotFoundException, Param, Put, Query} from "@nestjs/common";
import {UserService} from "../services";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AuthPayload} from "../../../common/auth/types";
import { AuthUser } from "src/common/auth/decorators";
import {ApiPagination, Pagination} from "../../../common/decorators";
import {PaginationDto} from "../../../common/dtos";
import {QueryUsersDto, UpdateProfileDto} from "../dtos";
import {SystemRole} from "../enums";
import {UserRoles} from "../../../common/auth/decorators/system-role.decorator";

@Controller()
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly user: UserService,
  ) {
  }

  @Get('/profile')
  @ApiOperation({ summary: "Get user profile" })
  async getProfile(@AuthUser() authPayload: AuthPayload) {
    const user = await this.user.getProfile(authPayload.sub)
    if (!user) throw new NotFoundException("User does not exist")

    return {
      message: 'Get user profile successfully!',
      data: user.toJSON()
    }
  }

  @Put('/profile')
  @ApiOperation({ summary: "Update user profile" })
  async updateProfile(
    @AuthUser() authPayload: AuthPayload,
    @Body() payload: UpdateProfileDto,
  ) {
    const updatedUser = await this.user.updateProfile(authPayload.sub, payload)

    return {
      message: 'User profile has been updated!',
      data: updatedUser.toJSON()
    }
  }

  @Get()
  @ApiOperation({ summary: "Find many users" })
  @ApiPagination()
  async findMany(
    @Query() query: QueryUsersDto,
    @Pagination() paginationDto: PaginationDto,
  ) {
    const pagination = await this.user.findMany(query, paginationDto)
    return {
      message: 'Find many users successfully',
      data: pagination.docs.map((doc) => doc.toJSON()),
      _pagination: pagination
    }
  }

  @Delete('/:userId')
  @UserRoles(SystemRole.ADMIN)
  @ApiOperation({ summary: "Delete one user" })
  async deleteOne(@Param('userId') userId: string) {
    return {
      message: 'Deleted user profile',
      data: await this.user.deleteOne(userId)
    }
  }
}