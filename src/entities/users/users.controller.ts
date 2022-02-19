import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { V1_SECURITY_PATH } from '../../contants/index';
import { CreateUserDTO } from './models/dto/createuser.dto';
import { UsersService } from './users.service';

@Controller(`${V1_SECURITY_PATH}/users`)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post(`/create`)
  create(@Body(new ValidationPipe()) user: CreateUserDTO) {
    return this.usersService.save(user);
  }
}
