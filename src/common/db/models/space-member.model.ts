import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IdLike } from '../../types';
import { Space } from './space.model';
import { User } from './user.model';
import { SpaceRole } from '../../../modules/space/enums';
import * as paginate from 'mongoose-paginate-v2';

@Schema({
  timestamps: true,
})
export class SpaceMember {
  _id: mongoose.Types.ObjectId

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
    default: SpaceRole.Member,
  })
  role: SpaceRole
}

export const SpaceMemberSchema = SchemaFactory.createForClass(SpaceMember)
SpaceMemberSchema.plugin(paginate)