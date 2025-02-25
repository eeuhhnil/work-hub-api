import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./common/db/db.module";
import { AuthModule } from "./common/auth/auth.module";
import { JwtAuthGuard } from "./common/auth/guards";
import { APP_GUARD } from "@nestjs/core";
import {UserModule} from "./modules/users/user.module";
import {SpaceModule} from "./modules/spaces/space.module";
import {ProjectModule} from "./modules/projects/project.module";
import {StorageModule} from "./common/storages/storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    StorageModule,
    AuthModule,
    UserModule,
    SpaceModule,
    ProjectModule
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
