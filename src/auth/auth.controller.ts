import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { V1_BASE_PATH } from '../contants/index';
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  //@Post(`${V1_BASE_PATH}/auth/login`)
  @Post(`auth/login`)
  async login(@Request() req) {
    console.log('SUCA');
    return this.authService.login(req.user);
  }
}
