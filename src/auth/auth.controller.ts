import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { V1_BASE_PATH } from '../contants/index';
import { ResetPasswordDTO } from './models/dto/reset-password.dto';
@Controller(`${V1_BASE_PATH}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(`/login`)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post(`/reset-password`)
  resetPassword(@Body(new ValidationPipe()) reset: ResetPasswordDTO) {
    return this.authService.changePassword(reset);
  }
}
