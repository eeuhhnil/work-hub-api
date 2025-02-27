import {Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {TaskService} from "../services";
import {CreateTaskDto, UpdateTaskDto} from "../dtos";
import {AuthUser} from "../../../common/auth/decorators";
import {AuthPayload} from "../../../common/auth/types";
import {SpaceMemberService} from "../../spaces/services";
import {ProjectMemberService} from "../../projects/services";
import {ProjectRole, SpaceRole, TaskStatus} from "../../../common/enums";

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly spaceMember: SpaceMemberService,
    private readonly projectMember: ProjectMemberService,
  ) {
  }

  @Post()
  @ApiOperation({summary: 'Create a task'})
  async createOne(
    @AuthUser() authPayload: AuthPayload,
    @Body() payload: CreateTaskDto,
  ) {
    const {space, project, assignee} = payload
    await Promise.all([
      this.spaceMember.checkMembership(space, authPayload.sub),
      this.projectMember.checkMembership(project, authPayload.sub),

      assignee ? this.spaceMember.checkMembership(space, assignee) : null,
      assignee ? this.projectMember.checkMembership(project, assignee) : null,
    ])

    const createdTask = await this.taskService.createOne({
      owner: authPayload.sub,
      assignee: assignee ? assignee: authPayload.sub,
      ...payload,
    })

    return {
      message: 'Created task successfully!',
      data: createdTask?.toJSON(),
    }
  }

  @Get(':taskId')
  @ApiOperation({summary: 'Get one task'})
  async findOne(
    @AuthUser() authPayload: AuthPayload,
    @Param('taskId') taskId: string,
  ) {
    const task = await this.taskService.findOne(taskId)
    if (!task) throw new NotFoundException(`Task not found`)

    await Promise.all([
      this.spaceMember.checkMembership(task.space as string, authPayload.sub),
      this.projectMember.checkMembership(task.project as string, authPayload.sub),
    ])

    await task.populate('space project assignee owner')

    return {
      message: 'Get one task successfully!',
      data: task.toJSON(),
    }
  }

  @Put(':taskId')
  @ApiOperation({summary: 'Update one task'})
  async updateOne(
    @AuthUser() authPayload: AuthPayload,
    @Param('taskId') taskId: string,
    @Body() payload: UpdateTaskDto,
  ) {
    const {sub} = authPayload
    const {assignee, status} = payload

    const task = await this.taskService.findOne(taskId)
    if (!task) throw new NotFoundException(`Task not found`)

    const [spaceMember, projectMember] = await Promise.all([
      this.spaceMember.checkMembership(task.space as string, sub),
      this.projectMember.checkMembership(task.project as string, sub),

      assignee ? this.spaceMember.checkMembership(task.space as string, assignee) : null,
      assignee ? this.projectMember.checkMembership(task.project as string, assignee) : null,
    ])

    if (
      task.owner as string !== sub
      && task.assignee as string !== sub
      && spaceMember.role !== SpaceRole.OWNER
      && projectMember.role !== ProjectRole.OWNER
    ) {
      throw new ForbiddenException(`Permission denied`)
    }

    const updatedTask = await this.taskService.updateOne(
      taskId,
      {
        completedAt: status === TaskStatus.COMPLETED ? new Date() : undefined,
        ...payload,
      }
    )
    await task.populate('space project assignee owner')

    return {
      message: 'Updated task successfully!',
      data: updatedTask.toJSON()
    }
  }

  @Delete(':taskId')
  @ApiOperation({summary: 'Delete task'})
  async deleteOne(
    @AuthUser() authPayload: AuthPayload,
    @Param('taskId') taskId: string,
  ) {
    const task = await this.taskService.findOne(taskId)
    if (!task) throw new NotFoundException(`Task not found`)

    const [spaceMember, projectMember] = await Promise.all([
      this.spaceMember.checkMembership(task.space as string, authPayload.sub),
      this.projectMember.checkMembership(task.project as string, authPayload.sub),
    ])

    if (
      task.owner as string !== authPayload.sub
      && task.assignee as string !== authPayload.sub
      && spaceMember.role !== SpaceRole.OWNER
      && projectMember.role !== ProjectRole.OWNER
    ) {
      throw new ForbiddenException(`Permission denied`)
    }

    await this.taskService.deleteOne(taskId)

    return {
      message: 'Deleted task successfully!',
    }
  }
}