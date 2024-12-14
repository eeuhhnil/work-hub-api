import {Injectable, NotFoundException} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos';
import {ConfigService} from "@nestjs/config";
import {AuthPayload} from "../../common/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName} = registerDto
    const hashedPassword = await bcrypt.hash(password, 10)

    return this.userService.create({
      username: await this.generateUniqueUsername(fullName),
      email: email,
      password: hashedPassword,
      fullName: fullName,
    })
  }

  async loginLocal(user: any) {
    const payload: AuthPayload = {
      sub: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      googleId: user.googleId,
      role: user.role,
    }

    const [ accessToken, refreshToken ] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign({
        sub: payload.sub
      }, {
        expiresIn: '7d',
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      })
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ email: email})
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async refreshToken(refreshToken: string) {
    const decodedPayload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    })

    const user = await this.userService.findOne({ _id: decodedPayload.sub })
    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    const newAccessToken = await this.jwtService.signAsync(
      {
        sub: user._id,
        username: user.username,
        fullName: user.fullName,
        googleId: user.googleId,
        role: user.systemRole,
      },
      {
        expiresIn: '12h',
      },
    )

    return {
      accessToken: newAccessToken,
    }
  }

  private async generateUniqueUsername(fullName: string): Promise<string> {
    let username: string
    while (true) {
      username = this.generateRandomUsername(fullName)
      const existingUser = await this.userService.exist({ username })
      if (!existingUser) break
    }

    return username
  }

  private generateRandomUsername(baseName: string): string {
    const sanitizedBaseName = baseName.replace(/\s+/g, '').toLowerCase()
    const randomSuffix = this.generateRandomString(6)

    return `${sanitizedBaseName}${randomSuffix}`
  }

  private generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * characters.length))

    return result
  }
}