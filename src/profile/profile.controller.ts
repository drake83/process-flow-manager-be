import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from '../entities/users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { V1_SECURITY_PATH } from '../contants/index';

@Controller(`${V1_SECURITY_PATH}/profile`)
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @Get(`/detail`)
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.username);
  }
}
