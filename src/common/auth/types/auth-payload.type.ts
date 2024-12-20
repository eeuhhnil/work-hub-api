import { SystemRole } from '../../../modules/user/types';

export type AuthPayload = {
  sub: string
  username: string
  email: string
  role: SystemRole
}