import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'common/library';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    console.log(req);
    return this.authService.googleLogin(req);
  }
}
