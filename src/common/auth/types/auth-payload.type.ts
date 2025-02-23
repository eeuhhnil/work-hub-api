import {SystemRole} from "../../enums";

export type AuthPayload = {
  sub: string
  username: string
  email: string
  role: SystemRole
}