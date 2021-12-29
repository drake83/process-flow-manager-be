import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { V1_BASE_PATH, V1_SECURITY_PATH } from '../contants/index';
import { Signup } from './models/dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(`${V1_BASE_PATH}/auth/login`)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post(`${V1_BASE_PATH}/auth/signup`)
  async signup(@Body() signupUser: Signup) {
    return this.authService.signup(signupUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(`${V1_SECURITY_PATH}/profile`)
  getProfile(@Request() req) {
    return req.user;
  }
}
