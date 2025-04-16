import * as AWS from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private readonly AssetModel: Model<Asset>,
    private readonly configService: ConfigService,
  ) {}
  private readonly bucketName = this.configService.get('S3_BUCKET_NAME');
  private getS3() {
    return new AWS.S3({
      region: this.configService.get('S3_BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_BUCKET_ACCESS_KEY'),
        secretAccessKey: this.configService.get('S3_BUCKET_SECRET_ACCESS_KEY'),
      },
    });
  }

  private async uploadFileToS3(file: Express.Multer.File) {
    const name = file.originalname;
    const extension = name.split('.').pop();
    const type = file.mimetype;
    const time = Date.now();
    const key = String(
      `${this.configService.get('S3_BUCKET_FOLDER')}/${name.replace(
        `.${extension}` as string,
        '',
      )}-${time}.${extension}`,
    );
    const params: AWS.PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: type,
      ContentDisposition: 'inline',
    };

    try {
      const s3 = this.getS3();
      const command = new AWS.PutObjectCommand(params);
      const s3Response = await s3.send(command);
      console.log(
        '🚀 ~ AssetsService ~ uploadFileToS3 ~ s3Response:',
        s3Response,
      );
      return s3Response;
    } catch (error) {
      console.error('🚀 ~ AssetsService ~ uploadFileToS3 ~ error:', error);
      throw new Error('Failed to upload file to S3!');
    }
  }

  async create(file: Express.Multer.File) {
    try {
      const fileUrl = await this.uploadFileToS3(file);
      const asset = await this.AssetModel.create({
        ...file,
        url: fileUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return asset;
    } catch (error) {
      console.error('🚀 ~ AssetsService ~ create ~ error:', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all assets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asset`;
  }

  remove(id: number) {
    return `This action removes a #${id} asset`;
  }
}
