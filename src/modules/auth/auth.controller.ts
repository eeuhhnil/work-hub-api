import { Controller, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('login/local')
  @ApiOperation({summary: 'Login local'})
  async loginLocal(@Request() req){
    return this.authService.loginLocal(req.user)
  }
}