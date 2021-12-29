export type Role = 'admin';

export class BaseUserDTO {
  username: string;

  userId: string;

  email: string;

  role: Role;

  resetPassword: boolean;

  created: Date;
}

export class UserDTO extends BaseUserDTO {
  password: string;
}
