import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { generate, verify } from 'password-hash';
import { User, UserDocument } from './models/schema/users.schema';
import { Model } from 'mongoose';
import { UserDTO } from './models/dto/users.dto';
import { CreateUserDTO } from './models/dto/createuser.dto';
import Permission from '../../enums/permissions/permissions';
import { UsersPermission } from '../../enums/permissions/users.permissions';
import { ProjectsPermission } from '../../enums/permissions/projects.permissions';
import { DataModelsPermission } from '../../enums/permissions/data-models.permissions';
import { ConnectionsPermission } from '../../enums/permissions/connections.permissions';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async onModuleInit() {
    await this.save({
      email: 'alessandro.drago@gmail.com',
      username: 'ROOT',
      permissions: [
        UsersPermission.AdminUsers,
        ProjectsPermission.AdminProjects,
        DataModelsPermission.AdminDataModels,
        ConnectionsPermission.AdminConnections,
      ],
    });
  }

  async find(username: string) {
    return this.userModel
      .findOne({ username: UsersService.encrypt(username) })
      .exec();
  }

  async findOne(username: string): Promise<UserDTO> {
    const found = await this.find(username);
    if (!found) {
      throw new NotFoundException();
    }
    const {
      email,
      username: usernamedDb,
      permissions,
      resetPassword,
      password,
      created,
    } = found;
    return new UserDTO({
      created,
      resetPassword,
      password,
      permissions: permissions.map(
        (permission) => UsersService.decrypt(permission) as Permission,
      ),
      email: UsersService.decrypt(email),
      username: UsersService.decrypt(usernamedDb),
    });
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async save(user: CreateUserDTO) {
    const { email, username, permissions = [] } = user;
    const found = await this.find(username);
    if (found) {
      throw new UnprocessableEntityException('User already present');
    }
    const created = await new this.userModel({
      ...user,
      username: UsersService.encrypt(username),
      email: UsersService.encrypt(email),
      password: UsersService.hashing('DUMMYPASSWORD'),
      created: new Date(),
      resetPassword: true,
      permissions: permissions.map((permission) =>
        UsersService.encrypt(permission),
      ),
    }).save();
    return new UserDTO({
      username: created.username,
      email: created.email,
      password: created.password,
      created: created.created,
      resetPassword: created.resetPassword,
      permissions: created.permissions,
    });
  }

  async update(user: UserDTO) {
    const { username, password, email, resetPassword, permissions = [] } = user;
    const filter = { username: UsersService.encrypt(username) };
    const update = {
      username: UsersService.encrypt(username),
      email: UsersService.encrypt(email),
      password: UsersService.hashing(password),
      resetPassword,
      permissions: permissions.map((permission) =>
        UsersService.encrypt(permission),
      ),
    };
    const updated = await this.userModel
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .exec();
    return new UserDTO({
      username: updated.username,
      email: updated.email,
      password: updated.password,
      created: updated.created,
      resetPassword: updated.resetPassword,
      permissions: updated.permissions,
    });
  }

  private static initVector = randomBytes(16);
  private static securityKey = randomBytes(32);

  static encrypt = (text: string): string => {
    const cipher = createCipheriv(
      'aes-256-cbc',
      UsersService.securityKey,
      UsersService.initVector,
    );
    return `${cipher.update(text, 'utf-8', 'hex')}${cipher.final('hex')}`;
  };

  static decrypt = (text: string): string => {
    const decipher = createDecipheriv(
      'aes-256-cbc',
      UsersService.securityKey,
      UsersService.initVector,
    );
    return `${decipher.update(text, 'hex', 'utf-8')}${decipher.final('utf8')}`;
  };

  static hashing(val: string) {
    return generate(val);
  }

  static verify(val: string, hashedPassword: string) {
    return verify(val, hashedPassword);
  }
}
