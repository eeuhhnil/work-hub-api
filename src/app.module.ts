import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./common/db/db.module";
import { AuthModule } from "./common/auth/auth.module";
import { JwtAuthGuard } from "./common/auth/guards";
import { APP_GUARD } from "@nestjs/core";
import { SpaceModule } from "./modules/space/space.module";
import { ProjectModule } from "./modules/project/project.module";
import {UserModule} from "./modules/users/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    UserModule,
    SpaceModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
