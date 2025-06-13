import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AssetDocument = HydratedDocument<Asset>;

@Schema({})
export class Asset {
  @Prop({
    required: true,
  })
  url: string;

  @Prop({
    required: false,
  })
  fieldname: string;

  @Prop({
    required: false,
  })
  originalname: string;

  @Prop({
    required: false,
  })
  size: number;

  @Prop({
    required: false,
  })
  filename: string;

  @Prop({
    required: false,
  })
  mimetype: string;

  @Prop({
    required: false,
  })
  path: string;

  @Prop({
    required: true,
    default: false,
    select: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: Date.now(),
  })
  updatedAt: Date;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
