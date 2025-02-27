import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IdLike } from '../../types';
import { Space } from './space.model';
import { User } from './user.model';
import * as paginate from 'mongoose-paginate-v2';
import {SpaceRole} from "../../enums";

@Schema({
  timestamps: true,
})
export class SpaceMember {
  @Prop({
    type: String,
    ref: 'Space',
  })
  space: IdLike<Space>

  @Prop({
    type: String,
    ref: 'User',
  })
  user: IdLike<User>

  @Prop({
    type: String,
    enum: Object.values(SpaceRole),
    default: SpaceRole.MEMBER,
  })
  role: SpaceRole
}

export const SpaceMemberSchema = SchemaFactory.createForClass(SpaceMember)
SpaceMemberSchema.plugin(paginate)