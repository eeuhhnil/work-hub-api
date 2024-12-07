import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'
import { StorageService } from './storage.service'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService): S3Client => {
        const region = configService.get<string>('S3_REGION')
        const accessKeyId = configService.get<string>('S3_ACCESS_KEY_ID')
        const secretAccessKey = configService.get<string>('S3_SECRET_ACCESS_KEY')

        if (!region || !accessKeyId || !secretAccessKey)
          throw new Error('Missing S3 configuration parameters')

        return new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        })
      },
      inject: [ConfigService],
    },
    {
      provide: 'S3_BUCKET',
      useFactory: (configService: ConfigService): string => {
        const bucket = configService.get<string>('S3_BUCKET_NAME')
        if (!bucket)
          throw new Error('Missing S3_BUCKET_NAME configuration')
        return bucket
      },
      inject: [ConfigService],
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}