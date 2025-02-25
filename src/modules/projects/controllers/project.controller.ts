import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query, UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags} from "@nestjs/swagger";
import {ProjectMemberService, ProjectService} from "../services";
import {CreateProjectDto, QueryProjectDto, UpdateProjectDto} from "../dtos";
import {AuthUser} from "../../../common/auth/decorators";
import {AuthPayload} from "../../../common/auth/types";
import {SpaceMemberService} from "../../spaces/services";
import {ApiPagination, Pagination} from "../../../common/decorators";
import {PaginationDto} from "../../../common/dtos";
import {FileInterceptor} from "@nestjs/platform-express";
import {StorageService} from "../../../common/storages/storage.service";
import * as path from "node:path";

@Controller('projects')
@ApiTags('Projects')
@ApiBearerAuth()
export class ProjectController {
  constructor(
    private readonly storage: StorageService,
    private readonly project: ProjectService,
    private readonly projectMember: ProjectMemberService,
    private readonly spaceMember: SpaceMemberService,
  ) {
  }

  @Post()
  @ApiOperation({ summary: "Create project" })
  async createOne(
    @AuthUser() authPayload: AuthPayload,
    @Body() payload: CreateProjectDto,
  ) {
    await this.spaceMember.checkOwnership(payload.space, authPayload.sub)

    const project = await this.project.createOne(authPayload.sub, payload)

    return {
      message: 'Created project successfully',
      data: project.toJSON(),
    }
  }

  @Get()
  @ApiOperation({ summary: "Find many projects" })
  @ApiPagination()
  async findMany(
    @AuthUser() authPayload: AuthPayload,
    @Query() query: QueryProjectDto,
    @Pagination() paginationDto: PaginationDto,
  ) {
    const pagination = await this.project.findMany(authPayload.sub, query, paginationDto)

    return {
      message: 'Find many projects successfully',
      data: pagination.docs.map((doc) => doc.toJSON()),
      _pagination: pagination,
    }
  }

  @Get(':projectId')
  @ApiOperation({ summary: "Get one project" })
  async findOne(
    @AuthUser() authPayload: AuthPayload,
    @Param('projectId') projectId: string,
  ) {
    await this.projectMember.checkMembership(projectId, authPayload.sub)

    const project = await this.project.findOne(projectId)
    if (!project) throw new NotFoundException(`Project not found`)

    return {
      message: 'Get project successfully',
      data: project.toJSON(),
    }
  }

  @Put(':projectId')
  @ApiOperation({ summary: "Update project" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        space: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        description: {
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
  async updateOne(
    @AuthUser() authPayload: AuthPayload,
    @Param('projectId') projectId: string,
    @Body() payload: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    await this.projectMember.checkOwnership(projectId, authPayload.sub)
    let avatar: string | undefined
    if (file) {
      const processedAvatar = await this.storage.processAvatarFile(file)
      const fileExtension = path.extname(processedAvatar.originalname)
      avatar = await this.storage.uploadPublicFile(`projects/${projectId}/${fileExtension}`, processedAvatar)
    }
    payload['avatar'] = avatar

    const updatedProject = await this.project.updateOne(projectId, payload)

    return {
      message: 'Updated project successfully',
      data: updatedProject.toJSON(),
    }
  }

  @Delete(':projectId')
  @ApiOperation({ summary: "Delete project by id" })
  async deleteOne(
    @AuthUser() authPayload: AuthPayload,
    @Param('projectId') projectId: string,
  ) {
    await this.projectMember.checkOwnership(projectId, authPayload.sub)

    return {
      message: 'Deleted project successfully',
      data: await this.project.deleteOne(projectId)
    }
  }
}