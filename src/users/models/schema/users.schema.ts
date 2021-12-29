import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Role = 'admin';

@Schema()
export class User {
  @Prop({ index: true, required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ index: true, required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ required: true })
  resetPassword: boolean;

  @Prop({ required: true })
  created: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
