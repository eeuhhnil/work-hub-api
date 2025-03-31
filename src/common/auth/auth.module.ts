import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as strategies from './strategies';
import {AuthService} from "./auth.service";

@Global()
@Module({

  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory(config: ConfigService) {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: {expiresIn: '1d'}
        }
      },
      inject: [ConfigService]
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...Object.values(strategies)
  ],
})
export class AuthModule {}