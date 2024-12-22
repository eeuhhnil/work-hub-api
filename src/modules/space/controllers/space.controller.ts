import { SpaceMemberService, SpaceService } from '../services';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../../common/auth/decorators';
import { AuthPayload } from '../../../common/auth/types';
import { CreateSpaceDto, GetSpaceDto } from '../dtos';
import { ApiPagination, Pagination } from '../../../common/decorators';
import { PaginationDto } from '../../../common/dtos';

@Controller('space')
@ApiTags('Space')
@ApiBearerAuth()
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly spaceMemberService: SpaceMemberService,
  ) {
  }

  @Post()
  @ApiOperation({summary: 'Create Space'})
  async createSpace(
    @AuthUser() authUser: AuthPayload,
    @Body() body: CreateSpaceDto,
  ) {
    return this.spaceService.createSpace(authUser.sub, body)
  }

  @Get()
  @ApiOperation({summary: 'Get Spaces'})
  @ApiPagination()
  async getSpaces(
    @AuthUser() authUser: AuthPayload,
    @Query() query: GetSpaceDto,
    @Pagination() pagination: PaginationDto,
  ) {
    return this.spaceService.getSpaces(authUser.sub, query, pagination)
  }

  @Delete(':id')
  async deleteSpace(
    @AuthUser() authUser: AuthPayload,
    @Param('id') id: string,
  ) {
    // await this.spaceMemberService.checkOwnership(id, authUser.sub)
    return this.spaceService.deleteSpace(id)
  }
}