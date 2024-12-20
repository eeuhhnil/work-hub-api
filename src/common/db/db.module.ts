import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { UserSchema } from './models';
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
      }
    ]),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}