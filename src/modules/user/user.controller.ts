import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }
}