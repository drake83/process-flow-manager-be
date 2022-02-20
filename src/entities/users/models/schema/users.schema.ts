import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import Permission from '../../../../enums/permissions/permissions';

@Schema()
export class User {
  @Prop({ index: true, required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  permissions: Permission[];

  @Prop({ required: true })
  resetPassword: boolean;

  @Prop({ required: true })
  created: Date;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
