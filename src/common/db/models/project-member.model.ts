import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IdLike } from '../../types';
import { Project } from './project.model';
import { User } from './user.model';
import { ProjectRole } from '../../../modules/project/enums';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
})
export class ProjectMember {
  _id: mongoose.Types.ObjectId

  @Prop({
    type: String,
    ref: 'Project',
  })
  project: IdLike<Project>

  @Prop({
    type: String,
    ref: 'User',
  })
  user: IdLike<User>

  @Prop({
    type: String,
    enum: Object.values(ProjectRole),
    default: ProjectRole.Member,
  })
  role: ProjectRole
}

export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember)
ProjectMemberSchema.plugin(paginate)