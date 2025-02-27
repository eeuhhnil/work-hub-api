import {Module} from "@nestjs/common";
import * as controllers from "./controllers/task.controller";
import * as services from "./services";
import {SpaceModule} from "../spaces/space.module";
import {ProjectModule} from "../projects/project.module";

@Module({
  imports: [SpaceModule, ProjectModule],
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(services)],
  exports: [...Object.values(services)],
})
export class TaskModule {}