import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {LoginLocalDto, RegisterDto} from "./dtos";
import {LocalAuthGuard} from "../../common/guards";

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Post('register')
  @ApiOperation({summary: 'Register'})
  async register(
    @Body() registerDto: RegisterDto,
  ){
    return this.authService.register(registerDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login/local')
  @ApiOperation({summary: 'Login local'})
  @ApiBody({type: LoginLocalDto})
  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async loginLocal(@Request() req){
    return this.authService.loginLocal(req.user)
  }
}