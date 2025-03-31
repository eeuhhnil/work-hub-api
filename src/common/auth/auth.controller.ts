import {Body, Controller, Get, Post, Req, Request, UnauthorizedException, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginLocalDto, RegisterDto } from './dtos';
import { LocalAuthGuard } from './guards';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { Public } from './decorators';
import {AuthGuard} from "@nestjs/passport";


@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register user local' })
  async handleRegister(@Body() payload: RegisterDto) {
    return this.authService.register(payload)
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirect user to Google login page
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    if (!req.user)
      throw new UnauthorizedException('Google authentication failed')

    return req.user
  }

  @Public()
  @Post('login/local')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login local' })
  async handleLoginLocal(@Body() payload: LoginLocalDto, @Request() req) {
    return this.authService.loginLocal(req.user)
  }

  @Public()
  @Post('refresh')
  @ApiOperation({summary: 'Refresh token'})
  async jwtRefresh(@Body() payload: RefreshTokenDto) {
    return this.authService.jwtRefresh(payload.refreshToken)
  }
}