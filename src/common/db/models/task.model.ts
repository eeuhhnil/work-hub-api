import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdLike } from '../../types';
import { User } from './user.model';
import { Space } from './space.model';
import { Project } from './project.model';
import { TaskStatus } from '../../../modules/Task/enums';
import mongoose from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
})
export class Task {
  _id: mongoose.Types.ObjectId

  @Prop({
    type: String,
  })
  name: string

  @Prop({
    type: String,
    required: false,
  })
  description?: string

  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.Pending,
  })
  status: TaskStatus

  @Prop({
    type: Date,
    required: false,
  })
  dueDate?: Date

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
  })
  owner: IdLike<User>

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
  })
  assignee: IdLike<User>

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Space',
  })
  space: IdLike<Space>

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Project',
  })
  project: IdLike<Project>
}

export const TaskSchema = SchemaFactory.createForClass(Task)
TaskSchema.plugin(paginate)