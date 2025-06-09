import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { EUserRole } from '@/types';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
    enum: EUserRole,
    default: EUserRole.USER,
  })
  role: string;

  @Prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;

  @Prop()
  createdBy?: string;

  @Prop()
  updatedBy?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
