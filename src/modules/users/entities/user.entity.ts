import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: {
    transform: (doc: UserDocument, user: User) => {
      delete user.password;
      return user;
    },
  },
})
export class User {
  @Prop({
    required: true,
  })
  fullName: string;

  @Prop({
    required: true,
  })
  birthDay: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

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

export const UserSchema = SchemaFactory.createForClass(User);
