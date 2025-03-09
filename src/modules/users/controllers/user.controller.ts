import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Query, UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import {UserService} from "../services";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AuthPayload} from "../../../common/auth/types";
import { AuthUser } from "src/common/auth/decorators";
import {ApiPagination, Pagination} from "../../../common/decorators";
import {PaginationDto} from "../../../common/dtos";
import {QueryUsersDto, UpdateProfileDto} from "../dtos";
import {UserRoles} from "../../../common/auth/decorators/system-role.decorator";
import {SystemRole} from "../../../common/enums";
import {FileInterceptor} from "@nestjs/platform-express";
import {StorageService} from "../../../common/storages/storage.service";
import * as path from "node:path";

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(
      private readonly storage: StorageService,
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

  @Get('/find')
  @ApiOperation({ summary: "Find user by email" })
  async findUserByEmail(@Query('email') email: string) {
    const user = await this.user.findUserByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    return{
      message: 'Get user profile successfully!',
      data: user.toJSON()
    }
  }


  @Put('/profile')
  @ApiOperation({ summary: "Update user profile" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        fullName: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
      FileInterceptor('file', {
        limits: {fileSize: 5 * 1024 * 1024},
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.startsWith('image/') || file.mimetype === 'image/gif') {
            return callback(new BadRequestException('Only images accepted'), false)
          }
          callback(null, true)
        },
      }),
  )
  async updateProfile(
      @AuthUser() authPayload: AuthPayload,
      @Body() payload: UpdateProfileDto,
      @UploadedFile() file?: Express.Multer.File
  ) {

    let avatar: string | undefined
    if (file) {
      const processedAvatar = await this.storage.processAvatarFile(file)
      const fileExtension = path.extname(processedAvatar.originalname)
      avatar = await this.storage.uploadPublicFile(`users/${authPayload.sub}/${fileExtension}`, processedAvatar)
    }
    payload['avatar'] = avatar
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