import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {DeleteObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client} from "@aws-sdk/client-s3";
import * as sharp from 'sharp';

@Injectable()
export class StorageService implements OnModuleInit {
  private logger = new Logger(StorageService.name)
  private s3Client: S3Client
  private s3Bucket: string

  constructor(
    private readonly config: ConfigService,
  ) {
  }

  onModuleInit() {
    this.s3Client = new S3Client({
      region: this.config.get<string>('S3_REGION') || '',
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY_ID') || '',
        secretAccessKey: this.config.get<string>('S3_SECRET_ACCESS_KEY') || '',
      },
    })
    this.s3Bucket = this.config.get<string>('S3_BUCKET_NAME') || 'ap-southeast-1'
  }

  async processAvatarFile(file: Express.Multer.File) {
    let processedImage: Buffer
    let outputMimetype: string
    let extension: string

    if (file.mimetype === 'image/png') {
      processedImage = await sharp(file.buffer)
        .resize(128, 128, { fit: 'cover' })
        .png({ compressionLevel: 8 })
        .toBuffer()
      outputMimetype = 'image/png'
      extension = '.png'
    } else {
      processedImage = await sharp(file.buffer)
        .resize(128, 128, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer()
      outputMimetype = 'image/jpeg'
      extension = '.jpg'
    }

    return {
      ...file,
      buffer: processedImage,
      mimetype: outputMimetype,
      originalname: file.originalname.replace(/\.[^/.]+$/, extension),
    }
  }

  async uploadPublicFile(fileKey: string, file: Express.Multer.File): Promise<string> {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.s3Bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command)

    return `https://${this.s3Bucket}.s3.${this.config.get<string>('S3_REGION')}.amazonaws.com/${fileKey}`
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.s3Bucket,
      Key: key,
    }

    const command = new DeleteObjectCommand(params)

    try {
      await this.s3Client.send(command)
      this.logger.log(`File with key '${key}' deleted successfully.`)
    } catch (error) {
      this.logger.error(`Error deleting file with key '${key}':`, error)
      throw error
    }
  }
}