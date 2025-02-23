import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query} from "@nestjs/common";
import {SpaceMemberService, SpaceService} from "../services";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AuthUser} from "../../../common/auth/decorators";
import {AuthPayload} from "../../../common/auth/types";
import {CreateSpaceDto, QuerySpacesDto, UpdateSpaceDto} from "../dtos";
import {PaginationDto} from "../../../common/dtos";
import {ApiPagination, Pagination} from "../../../common/decorators";

@Controller('spaces')
@ApiTags('Spaces')
@ApiBearerAuth()
export class SpaceController {
  constructor (
    private readonly space: SpaceService,
    private readonly spaceMember: SpaceMemberService,
  ) {
  }

  @Post()
  @ApiOperation({ summary: "Create a new space" })
  async createOne(@AuthUser() authPayload: AuthPayload, @Body() payload: CreateSpaceDto) {
    const space = await this.space.createOne(authPayload.sub, payload)

    return {
      message: `Created a new space`,
      data: space.toJSON(),
    }
  }

  @Get()
  @ApiOperation({ summary: "Get many spaces" })
  @ApiPagination()
  async findMany(
    @AuthUser() authPayload: AuthPayload,
    @Query() query: QuerySpacesDto,
    @Pagination() paginationDto: PaginationDto,
  ) {
    const pagination = await this.space.findMany(authPayload.sub, query, paginationDto)

    return {
      message: `Find many spaces successfully`,
      data: pagination.docs.map((doc) => doc.toJSON()),
      _pagination: pagination,
    }
  }

  @Get(':spaceId')
  @ApiOperation({ summary: "Find one space" })
  async findOne(@AuthUser() authPayload: AuthPayload, @Param('spaceId') spaceId: string) {
    await this.spaceMember.checkMembership(spaceId, authPayload.sub)

    const space = await this.space.findOne(spaceId)
    if (!space) throw new NotFoundException(`Space with id ${spaceId} not found`)

    return {
      message: `Get one space successfully`,
      data: space.toJSON()
    }
  }

  @Put(':spaceId')
  @ApiOperation({ summary: "Update one space" })
  async updateOne(
    @AuthUser() authPayload: AuthPayload,
    @Param('spaceId') spaceId: string,
    @Body() payload: UpdateSpaceDto,
  ) {
    await this.spaceMember.checkOwnership(spaceId, authPayload.sub)

    const updatedSpace = await this.space.updateOne(spaceId, payload)

    return {
      message: `Updated a new space`,
      data: updatedSpace ? updatedSpace.toJSON() : null,
    }
  }

  @Delete(':spaceId')
  @ApiOperation({ summary: "Delete one space" })
  async deleteOne(@AuthUser() authPayload: AuthPayload, @Param('spaceId') spaceId: string) {
    await this.spaceMember.checkOwnership(spaceId, authPayload.sub)

    return {
      message: `Deleted a space`,
      data: await this.space.deleteOne(spaceId)
    }
  }
}