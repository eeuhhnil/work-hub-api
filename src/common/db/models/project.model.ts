import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IdLike } from '../../types';
import { Space } from './space.model';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
})
export class Project {
  _id: mongoose.Types.ObjectId

  @Prop({
    type: String,
  })
  name: string

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Space',
  })
  space: IdLike<Space>

  @Prop({
    type: String,
    required: false,
  })
  avatar?: string

  @Prop({
    type: String,
    required: false,
  })
  description?: string
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
ProjectSchema.plugin(paginate)