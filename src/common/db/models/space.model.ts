import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';

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
}

export const SpaceSchema = SchemaFactory.createForClass(Space)
SpaceSchema.plugin(paginate)