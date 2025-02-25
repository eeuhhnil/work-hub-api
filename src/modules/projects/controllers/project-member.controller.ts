import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Query} from "@nestjs/common";
import {ProjectMemberService, ProjectService} from "../services";
import {AuthUser} from "../../../common/auth/decorators";
import {AuthPayload} from "../../../common/auth/types";
import {ApiOperation} from "@nestjs/swagger";
import {CreateProjectMemberDto, QueryProjectMemberDto} from "../dtos";
import {ProjectRole} from "../../../common/enums";
import {ApiPagination, Pagination} from "../../../common/decorators";
import {PaginationDto} from "../../../common/dtos";

@Controller('project')
export class ProjectMemberController {
  constructor(
    private readonly projectMember: ProjectMemberService,
    private readonly project: ProjectService,
  ) {
  }

  @Post()
  @ApiOperation({ summary: "Add member to project" })
  async addProjectMember(
    @AuthUser() authPayload: AuthPayload,
    @Body() payload: CreateProjectMemberDto,
  ) {
    await this.projectMember.checkOwnership(payload.project, authPayload.sub)
    const {role, ...projectMemberData} = payload
    await this.projectMember.addMemberToProject({
      role: role ? role : ProjectRole.MEMBER,
      ...projectMemberData,
    })

    return {
      message: 'Added member to project',
    }
  }

  @Get()
  @ApiOperation({ summary: "Get member from project" })
  @ApiPagination()
  async findMany(
    @AuthUser() authPayload: AuthPayload,
    @Query() query: QueryProjectMemberDto,
    @Pagination() paginationDto: PaginationDto,
  ) {
    await this.projectMember.checkOwnership(query.project, authPayload.sub)
    const pagination = await this.projectMember.findMany(query, paginationDto)

    return {
      message: 'Members from project',
      data: pagination.docs.map((doc) => doc.toJSON()),
      _pagination: pagination,
    }
  }

  @Delete(':projectMemberId')
  async removeMemberFromProject(
    @AuthUser() authPayload: AuthPayload,
    @Param('projectMemberId') projectMemberId: string,
  ) {
    const projectMember = await this.projectMember.findOne(projectMemberId)
    if (!projectMember) throw new NotFoundException(`Project member not found`)
    await this.projectMember.checkOwnership(projectMember.project as string, authPayload.sub)

    await this.projectMember.deleteOne(projectMemberId)

    return {
      message: 'Removed member from project',
    }
  }
}