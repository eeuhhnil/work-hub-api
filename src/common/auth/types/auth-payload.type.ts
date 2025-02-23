import {SystemRole} from "../../../modules/users/enums";

export type AuthPayload = {
  sub: string
  username: string
  email: string
  role: SystemRole
}