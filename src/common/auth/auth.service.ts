import { ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "./dtos";
import { UserService } from "../../modules/user/user.service";
import * as bcrypt from "bcrypt";
import { AuthPayload, JwtSign } from "./types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }

    return null;
  }

  async register(payload: RegisterDto) {
    const { email, password, fullName } = payload;
    const user = await this.userService.exists({ email });
    if (user) throw new ConflictException("USER_EXISTS");

    return this.userService.createUser({
      email,
      username: await this.generateUniqueUsername(fullName),
      password: bcrypt.hashSync(password, 10),
      fullName,
    });
  }

  async loginLocal(user: any) {
    const authPayload: AuthPayload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return this.jwtSign(authPayload);
  }

  async jwtRefresh(refreshToken: string): Promise<JwtSign> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
    });
    const user = await this.userService.findOne({ _id: payload.sub });

    const authPayload: AuthPayload = {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return this.jwtSign(authPayload);
  }

  private jwtSign(payload: AuthPayload): JwtSign {
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtSignRefresh(payload),
    };
  }

  private jwtSignRefresh(payload: AuthPayload): string {
    return this.jwtService.sign(
      { sub: payload.sub },
      {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      }
    );
  }

  private async generateUniqueUsername(fullName: string): Promise<string> {
    let username: string;
    while (true) {
      username = await this.generateRandomName(fullName);
      const existingUser = await this.userService.exists({ username });
      if (!existingUser) break;
    }

    return username;
  }

  private async generateRandomName(baseName: string): Promise<string> {
    const sanitizedBaseName = this.slugify(baseName);
    const randomSuffix = this.generateRandomSuffix(6);
    return `${sanitizedBaseName}-${randomSuffix}`;
  }

  private generateRandomSuffix(length: number): string {
    const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }

  private slugify(text: string): string {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
}
