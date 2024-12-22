import { Module } from '@nestjs/common';
import * as controllers from './controllers';
import * as services from './services';

@Module({
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(services)],
})
export class SpaceModule {}