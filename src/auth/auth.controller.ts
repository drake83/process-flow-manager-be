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
import { ResetPasswordDTO } from '../users/models/dto/password.dto';
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(`${V1_BASE_PATH}/auth/login`)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post(`${V1_BASE_PATH}/auth/reset-password`)
  resetPassword(@Body(new ValidationPipe()) reset: ResetPasswordDTO) {
    return this.authService.changePassword(reset);
  }
}
