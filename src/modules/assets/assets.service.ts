import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as AWS from 'aws-sdk';
import { Model } from 'mongoose';

import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private readonly AssetModel: Model<Asset>,
  ) {}

  private readonly bucketName = process.env.S3_BUCKET_NAME;
  private getS3() {
    return new AWS.S3({
      accessKeyId: process.env.S3_BUCKET_ACCESS_KEY,
      secretAccessKey: process.env.S3_BUCKET_SECRET_ACCESS_KEY,
    });
  }

  private async uploadFileToS3(file: Express.Multer.File) {
    const name = file.originalname;
    const extension = name.split('.').pop();
    const type = file.mimetype;
    const time = Date.now();

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: String(
        `filixer/${name.replace(
          `.${extension}` as string,
          '',
        )}-${time}.${extension}`,
      ),
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: type,
      ContentDisposition: 'inline',
    };

    try {
      const s3 = this.getS3();
      const s3Response = await s3.upload(params).promise();
      return s3Response.Location;
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
