import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { SpaceMemberSchema } from './space-member.model';

@Schema({
  timestamps: true,
})
export class Space {
  _id: mongoose.Types.ObjectId

  @Prop({
    type: String,
  })
  name: string

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

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDefault?: boolean
}

export const SpaceSchema = SchemaFactory.createForClass(Space)
SpaceSchema.plugin(paginate)
SpaceSchema.pre('deleteOne', {document: false, query: true}, async function(next) {
  try {
    await mongoose.model('SpaceMember', SpaceMemberSchema).deleteMany({space: this.getQuery()['_id']})
  } catch (error) {
    next(error)
  }
})