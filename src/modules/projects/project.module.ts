import {Module} from "@nestjs/common";
import * as controllers from './controllers'
import * as services from "./services"
import {SpaceModule} from "../spaces/space.module";

@Module({
  imports: [SpaceModule],
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(services)],
})
export class ProjectModule {}