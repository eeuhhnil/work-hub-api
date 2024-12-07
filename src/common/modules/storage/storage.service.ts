import {
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)

  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    @Inject('S3_BUCKET') private readonly s3Bucket: string,
  ) {}

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.s3Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })

    try {
      await this.s3Client.send(command)
      this.logger.log(`File uploaded successfully: ${key}`)
      return `https://${this.s3Bucket}.s3.${this.s3Client.config.region}.amazonaws.com/${key}`
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred during file upload'
      this.logger.error(`Failed to upload file: ${errorMessage}`)
      throw new Error(`Failed to upload file: ${errorMessage}`)
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.s3Bucket,
      Key: key,
    })

    try {
      await this.s3Client.send(command)
      this.logger.log(`File delete successfully: ${key}`)
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred during file deletion'
      this.logger.error(`Failed to delete file: ${errorMessage}`)
      throw new Error(`Failed to delete file: ${errorMessage}`)
    }
  }
}