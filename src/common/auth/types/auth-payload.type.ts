import { SystemRole } from '../../../modules/user/enums';

export type AuthPayload = {
  sub: string
  username: string
  email: string
  role: SystemRole
}