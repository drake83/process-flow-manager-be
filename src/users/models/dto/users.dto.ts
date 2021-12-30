import { Role } from '../schema/users.schema';

export class BaseUserDTO {
  username: string;

  email: string;

  roles: Role[];

  resetPassword: boolean;

  created: Date;
}

export class UserDTO extends BaseUserDTO {
  password: string;
}
