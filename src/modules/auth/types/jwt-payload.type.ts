import { SystemRole } from '../../user/types'

export type JwtPayload = {
  sub: string
  email: string
  username: string
  fullName: string
  role: SystemRole
}