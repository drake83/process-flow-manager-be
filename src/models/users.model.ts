import { Schema, model, Query, Document, Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

export type Role = 'admin';

export interface IBaseUser {
  username: string;

  userId: string;

  email: string;

  role: Role;

  resetPassword: boolean;
}

export interface IUser extends IBaseUser {
  password: string;
}

interface UserQueryHelpers {
  byUserName(name: string): Query<any, Document<IBaseUser>> & UserQueryHelpers;
}

const userSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
    index: true,
    unique: true,
    dropDups: true,
  },
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
    dropDups: true,
    // get: UsersService.decrypt,
    // set: UsersService.encrypt,
  },
  password: {
    type: String,
    required: true,
    //set: UsersService.hashing
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    // get: UsersService.decrypt,
    // set: UsersService.encrypt,
  },
  role: { type: String, required: true },
  resetPassword: { type: Boolean, required: true, default: true },
});

// Query helpers
userSchema.query.byUserName = function (
  username,
): Query<any, Document<IUser>> & UserQueryHelpers {
  return this.find({ username });
};

export const User = model<IBaseUser, Model<IUser, UserQueryHelpers>>(
  'User',
  userSchema,
);
