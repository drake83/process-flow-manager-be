import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersPermission } from '../../enums/permissions/users.permissions';
import PermissionGuard from '../../permissions/permission.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { V1_SECURITY_PATH } from '../../contants/index';
import { CreateUserDTO } from './models/dto/createuser.dto';
import { UsersService } from './users.service';

@Controller(`${V1_SECURITY_PATH}/users`)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post(`/create`)
  @UseGuards(
    PermissionGuard([UsersPermission.AdminUsers, UsersPermission.CreateUsers]),
  )
  @UseGuards(JwtAuthGuard)
  create(@Body(new ValidationPipe()) user: CreateUserDTO) {
    return this.usersService.save(user);
  }
}
