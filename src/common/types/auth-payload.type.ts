import {SystemRole} from "../../modules/user/types"

export class AuthPayload {
  sub: string
  username: string
  email: string
  fullName: string
  googleId?: string
  role: SystemRole
}