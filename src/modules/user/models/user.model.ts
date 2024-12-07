import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdLike } from '../../../common/types'
import { SystemRole } from '../types/system-role.type'

@Schema({
  timestamps: true
})
export class User {
  _id: IdLike<User>

  @Prop({
    type: String,
    required: true,
  })
  username: String

  @Prop({
    type: String,
    required: true,
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