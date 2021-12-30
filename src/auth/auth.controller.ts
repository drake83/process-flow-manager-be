import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { V1_BASE_PATH } from '../contants/index';
import { SignupDTO } from './models/dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(`${V1_BASE_PATH}/auth/login`)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post(`${V1_BASE_PATH}/auth/signup`)
  async signup(@Body() signupUser: SignupDTO) {
    return this.authService.signup(signupUser);
  }
}
