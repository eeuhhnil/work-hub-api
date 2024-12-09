import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
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
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email)
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user
      return result
    }

    return null
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
    const randomSuffix = this.generateRandomString(6)
    return `${baseName}${randomSuffix}`
  }

  private generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++)
      result += characters.charAt(Math.floor(Math.random() * characters.length))

    return result
  }
}