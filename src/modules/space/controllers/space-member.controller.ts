import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SpaceMemberService } from '../services';

@Controller('space')
@ApiTags('Space Member')
@ApiBearerAuth()
export class SpaceMemberController {
  constructor(
    private readonly spaceMemberService: SpaceMemberService,
  ) {
  }
}