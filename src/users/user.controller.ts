import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { V1_SECURITY_PATH } from '../contants/index';
import { CreateUserDTO } from './models/dto/users.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(`${V1_SECURITY_PATH}/profile`)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post(`${V1_SECURITY_PATH}/create`)
  create(@Body(new ValidationPipe()) user: CreateUserDTO) {
    return this.usersService.save(user);
  }
}
