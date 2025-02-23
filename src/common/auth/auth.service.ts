import { ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RegisterDto } from "./dtos";
import * as bcrypt from "bcrypt";
import { AuthPayload, JwtSign } from "./types";
import { JwtService } from "@nestjs/jwt";
import {DbService} from "../db/db.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly db: DbService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.db.user.findOne({ email }).select('+password')
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user.toJSON()
      return result;
    }

    return null;
  }

  async register(payload: RegisterDto) {
    const { email, password, fullName } = payload;
    const user = await this.db.user.exists({ email });
    if (user) throw new ConflictException("USER_EXISTS");

    return this.db.user.create({
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
    const payload = this.jwt.verify(refreshToken, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET"),
    });
    const user = await this.db.user.findOne({ _id: payload.sub });

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
      access_token: this.jwt.sign(payload),
      refresh_token: this.jwtSignRefresh(payload),
    };
  }

  private jwtSignRefresh(payload: AuthPayload): string {
    return this.jwt.sign(
      { sub: payload.sub },
      {
        secret: this.config.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      }
    );
  }

  private async generateUniqueUsername(fullName: string): Promise<string> {
    let username: string;
    while (true) {
      username = await this.generateRandomName(fullName);
      const existingUser = await this.db.user.exists({ username });
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
