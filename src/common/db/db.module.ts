import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ProjectMemberSchema, ProjectSchema, SpaceMemberSchema, SpaceSchema, TaskSchema, UserSchema } from './models';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<MongooseModuleOptions> => {
        return {
          uri: configService.get<string>('MONGO_URI'),
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Space',
        schema: SpaceSchema,
      },
      {
        name: 'SpaceMember',
        schema: SpaceMemberSchema,
      },
      {
        name: 'Project',
        schema: ProjectSchema,
      },
      {
        name: 'ProjectMember',
        schema: ProjectMemberSchema,
      },
      {
        name: 'Task',
        schema: TaskSchema,
      }
    ]),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}