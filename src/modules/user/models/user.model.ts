import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdLike } from '../../../common/types'
import { SystemRole } from '../types'

@Schema({
  timestamps: true
})
export class User {
  _id: IdLike<User>

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  username: String

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string

  @Prop({
    type: String,
    required: true,
  })
  fullName: string

  @Prop({
    type: String,
    required: false,
  })
  password?: string

  @Prop({
    type: String,
    required: false,
  })
  avatar?: string

  @Prop({
    type: String,
    required: false,
    unique: true,
  })
  googleId?: string

  @Prop({
    type: String,
    enum: SystemRole,
    required: false,
    default: SystemRole.User,
  })
  systemRole?: SystemRole
}

export const UserSchema = SchemaFactory.createForClass(User)